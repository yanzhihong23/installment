(function() {
  'use strict';

  angular
    .module('installment')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($scope, $state, $stateParams, $ionicLoading, md5, MSApi, NonoWebApi, userService, utils) {
    $scope.user = {
    	phone: $stateParams.phone
    };

    $scope.login = function() {
    	var phone = $scope.user.phone,
    			password = md5.createHash($scope.user.password);

			$ionicLoading.show();

    	MSApi.login({
    		phone: $scope.user.phone,
    		password: md5.createHash($scope.user.password)
    	}).success(function(data) {
    		if(+data.flag === 1) {
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

          $state.go('home');
    		} else {
    			utils.alert({
    				title: '出错了~',
    				content: data.msg
    			});
    		}
    	});
    };
  }
})();
