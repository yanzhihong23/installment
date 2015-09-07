(function() {
  'use strict';

  angular
    .module('installment')
    .directive('slogan', slogan);

  /** @ngInject */
  function slogan() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/slogan/slogan.html',
      replace: true,
      // scope: true,
      link: function(scope, element, attr) {
        
      }
    };

    return directive;
  }

})();
