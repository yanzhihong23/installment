(function() {
  'use strict';

  angular
    .module('installment')
    .controller('AuditController', AuditController)
    .controller('AuditPassController', AuditPassController);

  /** @ngInject */
  function AuditController($scope, $rootScope, $state, $ionicLoading, $ionicPopup, $log, utils, userService, NonoWebApi, MSApi, md5) {
  	var user = userService.getUser(),
  			sessionId = userService.getSessionId(),
  			passwordPopup;

		// for pay password popup
		$scope.user = {};

  	if(user && !user.hasPayPassword) {
  		passwordPopup = $ionicPopup.show({
  		  title: '设置支付密码',
  		  subTitle: '用于签收及还款时使用',
  		  templateUrl: 'app/card/password.popup.html',
  		  scope: $scope,
  		  cssClass: 'popup-large'
  		});
  	}

  	// pay password popup
  	$scope.submitPayPassword = function() {
  		$ionicLoading.show();
  	  MSApi.setPayPassword({
  	    sessionId: sessionId,
  	    payPassword: md5.createHash($scope.user.payPassword)
  	  }).success(function(data) {
  	    if(data.flag === 1) {
  	      passwordPopup.close();

  	      utils.alert({
  	        title: '恭喜您',
  	        content: '支付密码设置成功',
  	        callback: function() {
  	          // $state.go('account');
  	        }
  	      });
  	    } else {
  	      $log.error('set pay password failed', data.msg);
  	    }
  	  })
  	};
  }

  /** @ngInject */
  function AuditPassController($scope, $rootScope, $state, $ionicLoading, $ionicPopup, $log, utils, userService, NonoWebApi, MSApi, md5) {
  	var passwordPopup;

  	$scope.user = {};

  	// get order info
  	NonoWebApi.getOrderStauts().success(function(data) {
  		if(+data.result === 1) {
  			var order = data.map;
  			$scope.order = {
  				duration: order.expectNum,
  				perRepay: order.toBeRepayPerMonth
  			};
  		}
  	});

  	$scope.sign = function() {
  		passwordPopup = $ionicPopup.show({
  		  title: '请输入支付密码',
  		  templateUrl: 'app/audit/password.popup.html',
  		  scope: $scope,
  		  cssClass: 'popup-large'
  		});
  	};

  	$scope.forgotPayPassword = function() {
  		passwordPopup.close();
  		$state.go('payPassword:forgot');
  	};

  	// pay password popup
  	$scope.submitPayPassword = function() {
  		passwordPopup.close();
  		var payPassword = md5.createHash($scope.user.payPassword);

  		$ionicLoading.show();
  		NonoWebApi.sign({payPassword: payPassword}).success(function(data) {
  			if(+data.result === 1) {
  				$state.go('sign');
  			} else {
  				utils.alert({
  					content: data.message,
  					callback: function() {
  						if(+data.result === 0) {
  							$scope.sign();
  						}
  					}
  				});
  			}
  		})
  	};
  }
})();