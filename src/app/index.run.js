(function() {
  'use strict';

  angular
    .module('installment')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $rootScope, $ionicLoading, userService, $location, utils, localStorageService) {
  	$rootScope.passwordPattern = /^(?!\d+$|[a-zA-Z]+$|[\W-_]+$)[\s\S]{6,16}$/;

    $rootScope.$on('loading:hide', function() {
      $ionicLoading.hide();
    });

    // orderId & openId init
    var orderInit = function() {
      var search = utils.getLocationSearch(),
          $search = $location.search(),
          order = localStorageService.get('order');

      var _openId = search.openId || $search.openId || Math.floor(Math.random()*1000000),
          _orderId = search.orderId || $search.orderId || Math.floor(Math.random()*1000000);

      if(!search.openId && !$search.openId) return;

      if(!order || (order.openId !== _openId)) {
        order = {
          openId: _openId,
          orderId: _orderId
        };

        localStorageService.remove('user', 'mId', 'sessionId');
      } else if(order.openId === _openId && order.orderId !== _orderId) {
        order.orderId = _orderId;
      }

      localStorageService.add('order', order);
    };

    orderInit();

    // auto login
    userService.autoLogin();

    $log.info('runBlock end');
  }

})();
