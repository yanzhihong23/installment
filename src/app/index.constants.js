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
