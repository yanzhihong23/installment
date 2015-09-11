(function() {
  'use strict';

  angular
    .module('installment')
    .controller('OrderController', OrderController);

  /** @ngInject */
  function OrderController($scope, $state, $ionicLoading, $log, utils, NonoWebApi, localStorageService) {
    $scope.order = {
      openId: Math.floor(Math.random()*1000000),
      orderId: Math.floor(Math.random()*100000000),
      aim: 'buy iPhone',
      amount: Math.floor(Math.random()*10000),
      expect: Math.floor(Math.random()*12) + 1,
      orderStatus: 2,
      address: 'address No. ' + Math.floor(Math.random()*10000)
    };

    $scope.submit = function() {
      var order = angular.copy($scope.order);
      order.orderTime = moment().format("YYYY-MM-DD hh:mm:ss");
      // order.orderTime = '2015-08-13 11:42:52';

      $ionicLoading.show();
      NonoWebApi.submitOrder(order)
        .success(function(data) {
          if(+data.result === 1) {
            localStorageService.add('order', $scope.order);
            $state.go('home', {openId: $scope.order.openId, orderId: $scope.order.orderId, mock: true});
          } else {
            utils.alert({content: data.message});
          }
        });
    }
  }
})();
