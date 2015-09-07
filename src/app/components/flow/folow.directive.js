(function() {
  'use strict';

  angular
    .module('installment')
    .directive('flow', flow);

  /** @ngInject */
  function flow() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/flow/flow.html',
      replace: true,
      scope: true,
      link: function(scope, element, attr) {
        scope.stage = +attr.stage;
        scope.name = attr.name;
      }
    };

    return directive;
  }

})();
