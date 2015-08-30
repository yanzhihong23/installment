(function() {
  'use strict';

  angular
    .module('installment')
    .config(config);

  /** @ngInject */
  function config($logProvider, $httpProvider, $provide, localStorageServiceProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Enable cors
    // $httpProvider.defaults.useXDomain = true;
    // delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $httpProvider.interceptors.push(function($rootScope) {
      return {
        request: function(config) {
          return config;
        },
        response: function(response) {
          $rootScope.$broadcast('loading:hide')
          return response;
        }
      }
    });

    $provide.decorator('$locale', ['$delegate', function($delegate) {
      if($delegate.id == 'en-us') {
        $delegate.NUMBER_FORMATS.PATTERNS[1].negPre = '-\u00A4';
        $delegate.NUMBER_FORMATS.PATTERNS[1].negSuf = '';
      }
      return $delegate;
    }]);

    localStorageServiceProvider.setPrefix('installment');
  }

})();
