(function() {
  'use strict';

  angular
    .module('installment')
    .controller('PhoneController', PhoneController);

  /** @ngInject */
  function PhoneController($scope, $state, $ionicLoading, NonoWebApi, utils) {
  	$scope.user = {};

  	$scope.checkPhone = function() {
  		$ionicLoading.show();

  		NonoWebApi.isRegister({phone: $scope.user.phone})
  			.success(function(data) {
  				if(+data.result === 1) {
  					utils.confirm({
  						content: '手机号已在0元付服务提供方名校贷注册，亲可以直接登录',
  						okText: '登录',
  						onOk: function() {
  							$state.go('login', {phone: $scope.user.phone});
  						}
  					});
  				} else {
  					$state.go('register', {phone: $scope.user.phone});
  				}
  			});


			// UserApi.isAuthenticatedSchoolRoll({phone: $scope.user.phone})
  	};
  }
})();
