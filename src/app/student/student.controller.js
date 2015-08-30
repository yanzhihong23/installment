(function() {
  'use strict';

  angular
    .module('installment')
    .controller('StudentAuthController', StudentAuthController)
    .controller('StudentAuthFailController', StudentAuthFailController);

  /** @ngInject */
  function StudentAuthController($scope, $state, $ionicActionSheet, $ionicPopup, $ionicLoading, $log, NonoWebApi, localStorageService, userService, utils) {
  	$scope.user = {
  		phone: userService.getUser().phone
  	};

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
					$scope.user.year = buttons[index].text;
					return true;
				}
			});
    };

    $scope.selectDegree = function() {
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
					$scope.user.degree = buttons[index].text;
					return true;
				}
			});
    };

    $scope.submit = function() {
    	$ionicLoading.show();

    	NonoWebApi.authenticateSchoolRoll($scope.user)
    		.success(function(data) {
    			if(+data.result === 1) {
    				$log.info('school auth success');

            // save user credit info
            var credit = data.map.creditLine;
            var user = userService.getUser();
            // save realname and idNo for add card
            user.realname = $scope.user.realname;
            user.idNo = $scope.user.idNo;
            user.credit = credit;
            userService.setUser(user);

    				Math.random()*10000 > 5000 ? $state.go('card') : $state.go('id');
    			} else {
    				$log.error('school auth fail', data.message);

            var user = userService.getUser();
            // save realname and idNo for add card
            user.realname = $scope.user.realname;
            user.idNo = $scope.user.idNo;
            userService.setUser(user);

    				$state.go('studentAuth:fail');
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
  }
})();
