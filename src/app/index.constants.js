(function() {
  'use strict';

  angular
    .module('installment')
    .constant('HOST', 'http://openapi.test.nonobank.com')
    .constant('MERCHANT', '10000')
    .constant('PRODUCTID', '89')
    .factory('ORDER', function($location, $log, utils, localStorageService) {
        var search = utils.getLocationSearch(),
            $search = $location.search(),
            order = localStorageService.get('order');

        if(!order) {
          order = {
            openId: search.openId || $search.openId || Math.floor(Math.random()*1000000),
            orderId: search.orderId || $search.orderId || Math.floor(Math.random()*1000000)
          };

          localStorageService.add('order', order);
        }

        $log.info('order', order);
        return order;
    })
    .factory('APISERVER', function(HOST, $location) {
    	var host = /nonobank.com/.test($location.host()) ? $location.protocol() + '://' + $location.host() : HOST;
    	return {
    		MSAPI: host + '/msapi',
    		NONOWEB: host + '/nono-web'
    	};
    })
    .constant('$ionicLoadingConfig', {
	    template: '<ion-spinner icon="bubbles" class="spinner-positive"></ion-spinner>'
	  })

})();
