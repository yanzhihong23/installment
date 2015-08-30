(function() {
  'use strict';

  angular
    .module('installment')
    .directive('bottom', bottom);

  /** @ngInject */
  function bottom() {
    var directive = {
      restrict: 'A',
      link: function(scope, element, attr) {
        element.addClass('bottom').parent().addClass('relative');

        if(element.parent().hasClass('scroll')) {
          element.parent().addClass('full-height');
        }
      }
    };

    return directive;
  }

})();
