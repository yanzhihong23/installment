(function() {
  'use strict';

  angular
    .module('installment')
    .controller('AccountController', AccountController);

  /** @ngInject */
  function AccountController($scope, $state, $ionicLoading, $ionicPopup, $log, NonoWebApi) {
    $scope.account = {
      availabelCredit: 0,
      overdueDays: 0,
      repayment: 0
    };

    NonoWebApi.getAvailableCreditLine().success(function(data) {
      if(+data.result === 1) {
        $scope.account.availabelCredit = +data.map.availableCreditLine;
      }
    });

  	NonoWebApi.getAccountSummary().success(function(data) {
      if(+data.result === 1) {
        $scope.account.overdueDays = +data.map.overdueDays;
        $scope.account.repayment = +data.map.repayment;
        $scope.account.lastRepaymentDate = data.map.lastRepaymentDate;
      }
    });
  }
})();
