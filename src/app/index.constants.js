(function() {
  'use strict';

  angular
    .module('installment')
    .constant('HOST', 'http://openapi.test.nonobank.com')
    .constant('MERCHANT', '10000')
    .constant('PRODUCTID', '89')
    .factory('ORDER', function($location, $log, utils, localStorageService) {
        var order = localStorageService.get('order');

        $log.info('order', order);
        return order;
    })
    .factory('APISERVER', function(HOST, $location, $log) {
    	var host = /nonobank.com/.test($location.host()) ? $location.protocol() + '://' + $location.host() + ($location.port() ? ':' + $location.port() : '') : HOST;

      $log.info('host', host);
    	return {
    		MSAPI: host + '/msapi',
    		NONOWEB: host + '/nono-web'
    	};
    })
    .constant('$ionicLoadingConfig', {
	    template: '<ion-spinner icon="bubbles" class="spinner-positive"></ion-spinner>'
	  })

})();
