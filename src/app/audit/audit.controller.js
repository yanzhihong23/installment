(function() {
  'use strict';

  angular
    .module('installment')
    .controller('AuditController', AuditController)
    .controller('AuditPassController', AuditPassController);

  /** @ngInject */
  function AuditController() {
  	
  }

  /** @ngInject */
  function AuditPassController($scope, $state, $ionicLoading, $ionicPopup, $log, utils, userService, NonoWebApi, md5) {
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
