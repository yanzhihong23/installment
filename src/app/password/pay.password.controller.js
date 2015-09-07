(function() {
  'use strict';

  angular
    .module('installment')
    .controller('PayPasswordController', PayPasswordController);

  /** @ngInject */
  function PayPasswordController($scope, $state, $stateParams, $ionicLoading, $log, MSApi, utils, userService) {
  	var resendCountdown = utils.resendCountdown($scope),
        user = userService.getUser(),
        sessionId = userService.getSessionId();

    $scope.user = {
    	phone: user && user.phone,
      sessionId: sessionId
    };

    $scope.sendSms = function() {
    	$ionicLoading.show();
    	MSApi.sendSmsForRetrievePayPassword($scope.user)
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
    	MSApi.retrievePayPassword($scope.user)
    		.success(function(data) {
    			if(data.flag === 1) {
            utils.alert({
              title: '恭喜您~',
              content: '成功找回支付密码~',
              callback: function() {
                utils.goBack();
              }
            });
    			} else {
    				utils.alert({content: data.msg});
    			}
    		});
    };

  }
})();
