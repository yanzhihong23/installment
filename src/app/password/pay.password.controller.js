(function() {
  'use strict';

  angular
    .module('installment')
    .controller('PayPasswordController', PayPasswordController);

  /** @ngInject */
  function PayPasswordController($scope, $ionicLoading, $log, MSApi, utils, userService, md5) {
  	var resendCountdown = utils.resendCountdown($scope),
        user = userService.getUser(),
        sessionId = userService.getSessionId();

    $scope.user = {
    	phone: user && user.phone
    };

    $scope.$watch('user.confirm', function(val) {
      if(val && val !== $scope.user.password) {
        $scope.notMatch = true;
      } else {
        $scope.notMatch = false;
      }
    }, true);

    $scope.sendSms = function() {
    	$ionicLoading.show();
    	MSApi.sendSmsForRetrievePayPassword({
        sessionId: sessionId,
        phone: $scope.user.phone
      }).success(function(data) {
					if(data.flag === 1) {
						resendCountdown();
					} else {
						utils.alert({content: data.msg});
					}
				});
    };

    $scope.submit = function() {
    	$ionicLoading.show();
    	MSApi.retrievePayPassword({
        sessionId: sessionId,
        vcode: $scope.user.vcode,
        password: md5.createHash($scope.user.password)
      }).success(function(data) {
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
