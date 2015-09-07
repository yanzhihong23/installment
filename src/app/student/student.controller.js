(function() {
  'use strict';

  angular
    .module('installment')
    .controller('StudentAuthController', StudentAuthController)
    .controller('StudentAuthFailController', StudentAuthFailController);

  /** @ngInject */
  function StudentAuthController($scope, $state, $ionicActionSheet, $ionicPopup, $ionicLoading, $ionicModal, $log, $timeout, NonoWebApi, MSApi, localStorageService, userService, utils, md5) {
  	$scope.user = {};

    $scope.doLogin = $scope.doRegister = false;

    var user = userService.getUser();
    if(user && user.phone) {
      $scope.user.phone = user.phone;
      $scope.showPhoneInfo = true;
    }

    var phonePopup, kycPopup, schoolPopup, privacyModal,
        resendCountdown = utils.resendCountdown($scope);

    /******** phone popup block start ********/
    $scope.showPhonePopup = function() {
      phonePopup = $ionicPopup.show({
        title: '手机验证',
        templateUrl: 'app/student/phone.popup.html',
        scope: $scope,
        cssClass: 'popup-large'
      });
    };

    // phone poup submit
    $scope.submitUser = function() {
      $ionicLoading.show();
      $scope.doLogin ? login() : register();
    };

    // do login or register base on phone value
    $scope.$watch('user.phone', function(val) {
      if(val) {
        $ionicLoading.show();
        NonoWebApi.isRegister({phone: val}).success(function(data) {
          if(+data.result === 1) {
            $scope.doLogin = true;
            $scope.doRegister = false;
          } else {
            $scope.doLogin = false;
            $scope.doRegister = true;
          }
        })
      }
    });

    // send register verify code
    $scope.sendVcode = function() {
      $ionicLoading.show();

      NonoWebApi.sendSms($scope.user).success(function(data) {
        if(+data.result === 1) {
          resendCountdown();
        } else {
          phonePopupErrorAlert(data.message);
        }
      });
    };

    var login = function() {
      var phone = $scope.user.phone,
          password = md5.createHash($scope.user.password);

      MSApi.login({
        phone: phone,
        password: password
      }).success(function(data) {
        if(+data.flag === 1) {
          // login success, close phone popup
          phonePopup.close();
          $scope.showPhoneInfo = true;

          var data = data.data;
          // login success, save user info
          userService.setUser({
            phone: phone,
            password: password,
            realname: data.realname,
            idNo: data.idnum,
            hasPayPassword: !!data.is_pay_password,
            hasCard: !!data.is_set_bank
          });

          userService.setSessionId(data.session_id);
          userService.setMId(data.m_id);

          // $state.go('home');
        } else {
          phonePopupErrorAlert(data.msg);
        }
      });
    };

    var register = function() {
      NonoWebApi.register($scope.user).success(function(data) {
        if(+data.result === 1) {
          $log.info('register success');
          // register success, close phone popup
          phonePopup.close();
          $scope.showPhoneInfo = true;

          // save user info
          userService.setUser({
            phone: $scope.user.phone,
            password: data.map.password
          });

          userService.setSessionId(data.map.sessionId);
        } else {
          phonePopupErrorAlert(data.message);
        }
      });
    };

    var phonePopupErrorAlert = function(msg) {
      phonePopup.close();
      utils.alert({
        content: msg,
        callback: function() {
          $scope.showPhonePopup();
        }
      });
    };
    /******** phone popup block end ********/


    /******** kyc popup block start ********/
    $scope.showKycPopup = function() {
      kycPopup = $ionicPopup.show({
        title: '实名信息',
        templateUrl: 'app/student/kyc.popup.html',
        scope: $scope,
        cssClass: 'popup-large'
      });
    };

    // kyc poup submit
    $scope.submitKyc = function() {
      $scope.showKycInfo = true;
      kycPopup.close();
    };
    /******** kyc popup block end ********/


    /******** school popup block start ********/
    $scope.showSchoolPopup = function() {
      schoolPopup = $ionicPopup.show({
        title: '学籍认证',
        templateUrl: 'app/student/school.popup.html',
        scope: $scope,
        cssClass: 'popup-large'
      });
    };
    // school poup submit
    $scope.submitSchool = function() {
      $scope.showSchoolInfo = true;
      schoolPopup.close();
    };
     /******** school popup block end ********/


  	var initSchoolList = function() {
  		$scope.schoolList = localStorageService.get('schoolList');
  		if(!$scope.schoolList) {
  			NonoWebApi.getSchoolList().success(function(data) {
  				if(+data.result === 1) {
  					$scope.schoolList = data.list.map(function(obj) {
  						return obj.name;
  					});

  					localStorageService.add('schoolList', $scope.schoolList);
  					$log.debug($scope.schoolList);
  				}
  			});
  		}
  	};

  	initSchoolList();

    $scope.selectYear = function() {
      schoolPopup.close();

    	var buttons = [
    		{ text: '2015' },
    		{ text: '2014' },
    		{ text: '2013' },
    		{ text: '2012' },
    		{ text: '2011' },
    		{ text: '2010' },
    		{ text: '2009' }
    	];
    	// Show the action sheet
			var hideSheet = $ionicActionSheet.show({
			 	buttons: buttons,
				// destructiveText: 'Delete',
				titleText: '选择入学年份',
				cancelText: '取消',
				cancel: function() {
			    // add cancel code..
			  },
				buttonClicked: function(index) {
          $scope.showSchoolPopup();

					$scope.user.year = buttons[index].text;
					return true;
				}
			});
    };

    $scope.selectDegree = function() {
      schoolPopup.close();

    	var buttons = [
				{ text: '专科' },
				{ text: '本科' },
				{ text: '硕士研究生' },
				{ text: '博士研究生' }
			]
    	// Show the action sheet
			var hideSheet = $ionicActionSheet.show({
				buttons: buttons,
				// destructiveText: 'Delete',
				titleText: '选择学历',
				cancelText: '取消',
				cancel: function() {
			    // add cancel code..
			  },
				buttonClicked: function(index) {
          $scope.showSchoolPopup();

					$scope.user.degree = buttons[index].text;
					return true;
				}
			});
    };

    $scope.selectMajor = function() {
      schoolPopup.close();

      var buttons = [
        { text: '工学' },
        { text: '管理学' },
        { text: '艺术学' },
        { text: '文学' },
        { text: '教育学' },
        { text: '经济学' },
        { text: '理学' },
        { text: '法学' }
      ]
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        buttons: buttons,
        // destructiveText: 'Delete',
        titleText: '选择专业',
        cancelText: '取消',
        cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(index) {
          $scope.showSchoolPopup();

          $scope.user.major = buttons[index].text;
          return true;
        }
      });
    };

    /****** privacy modal ********/
    $scope.showPrivacyModal = function() {
      phonePopup.close();
      $timeout(function() {
        privacyModal.show();
      }, 100);
    };

    $scope.closePrivacyModal = function() {
      $scope.showPhonePopup();
      privacyModal.hide();
    };

    $ionicModal.fromTemplateUrl('app/register/privacy.tos.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      privacyModal = modal;
    });


    // submit student info
    $scope.submitStudentInfo = function() {
      var params = angular.copy($scope.user);
      params.sessionId = userService.getSessionId();

      $ionicLoading.show();
      MSApi.saveStudentInfo(params).success(function(data) {
        if(data.flag === 8) { // save success
          // utils.alert({
          //   title: '恭喜你，学籍信息验证已通过！',
          //   callback: function() {
          //     $state.go('contact');
          //   }
          // })
          applyCheck();
        } else {
          // utils.alert({content: data.msg});
          $state.go('studentAuth:fail');
        }
      })
    };

    var applyCheck = function() {
      NonoWebApi.studentApply().success(function(data) {
        if(+data.result === 1) {
          userService.setQuotaStatus('passed');
          $state.go('contact');
        } else {
          userService.setQuotaStatus('failed');
          localStorageService.add('lastApplyTime', moment().format('YYYY-MM-DD hh-mm-ss'));
          $state.go('quota');
        }
      });
    };
  }

  function StudentAuthFailController($scope, $ionicPopup, $ionicLoading, $log, utils, userService, MSApi) {
  	var myPopup;

  	$scope.data = {
  		sessionId: userService.getSessionId()
  	};

  	$scope.back = function() {
  		utils.goBack();
  	};

  	$scope.submit = function() {
  		$log.debug('code', $scope.data.code);

      $ionicLoading.show();
  		MSApi.studentCodeAuth($scope.data).success(function(data) {
  			if(data.flag === 1) {
  				$log.info('school auth success');

          // save user credit info
          var user = userService.getUser();
          user.credit = data.data.creditLine;
          userService.setUser(user);

  				Math.random()*10000 > 5000 ? $state.go('card') : $state.go('id');
  			} else {
  				$log.error('school auth fail', data.msg);

  				utils.alert({content: data.msg});
  			}
  		}).finally(function() {
  			myPopup.close();
  		});
  	};

  	$scope.codeAuth = function() {
  		// An elaborate, custom popup
  		myPopup = $ionicPopup.show({
  		  templateUrl: 'app/student/code.auth.popup.html',
  		  title: '学籍码',
  		  scope: $scope,
  		  cssClass: 'popup-large'
  		});
  	};

    $scope.getCode = function() {
      myPopup.close();
      utils.alert({
        title: '学信网查询码获得流程',
        contentUrl: 'app/student/code.get.popup.html',
        cssClass: 'popup-large',
        callback: function() {
          $scope.codeAuth();
        }
      })
    };
  }
})();
