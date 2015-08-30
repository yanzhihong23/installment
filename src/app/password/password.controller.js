(function() {
  'use strict';

  angular
    .module('installment')
    .controller('PasswordController', PasswordController)
    .controller('ResetPasswordController', ResetPasswordController);

  /** @ngInject */
  function PasswordController($scope, $state, $stateParams, $ionicLoading, $log, MSApi, utils, userService) {
  	var resendCountdown = utils.resendCountdown($scope);

    $scope.user = {
    	phone: $stateParams.phone
    };

    $scope.sendSms = function() {
    	$log.debug('sendSms');

    	$ionicLoading.show();
    	MSApi.sendSmsForRetrievePassword($scope.user)
				.success(function(data) {
					if(data.flag === 1) {
						resendCountdown();
					} else {
						utils.alert({content: data.msg});
					}
				});
    };

    $scope.submit = function() {
    	$ionicLoading.show();
    	MSApi.findPassword($scope.user)
    		.success(function(data) {
    			if(data.flag === 5) {
    				userService.setSessionId(data.data.session_id);
    				$state.go('password:reset', {phone: $scope.user.phone});
    			} else {
    				utils.alert({content: data.msg});
    			}
    		});
    };

  }

  function ResetPasswordController($scope, $state, $stateParams, $ionicLoading, $log, md5, MSApi, utils, userService) {
  	$scope.user = {
    	phone: $stateParams.phone
    };

  	$scope.submit = function() {
  		$ionicLoading.show();
  		var sessionId = userService.getSessionId(),
  				password = md5.createHash($scope.user.password);
  		MSApi.changeFindPassword({
  			sessionId: sessionId,
  			password: password
  		}).success(function(data) {
  				if(data.flag === 3) {
  					userService.setUser({
  						phone: $scope.user.phone,
  						password: password
  					});

  					utils.alert({
  						content: '密码修改成功~',
  						callback: function() {
  							$state.go('home');
  						}
  					});
  				} else {
  					utils.alert({content: data.msg});
  				}
  			});
  	}
  }
})();
