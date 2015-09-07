(function() {
  'use strict';

  angular
    .module('installment')
    .directive('plusIcon', plusIcon);

  /** @ngInject */
  function plusIcon() {
    var directive = {
      restrict: 'E',
      template: '<i class="icon ion-ios-plus-empty positive"></i>',
      replace: true,
      // scope: true,
      link: function(scope, element, attr) {
        
      }
    };

    return directive;
  }

})();
