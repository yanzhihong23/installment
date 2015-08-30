(function() {
  'use strict';

  angular
    .module('installment')
    .directive('step', step);

  /** @ngInject */
  function step() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/step/step.html',
      replace: true,
      scope: true,
      link: function(scope, element, attr) {
        scope.name = attr.name;
        scope.desc = attr.desc;
      }
    };

    return directive;
  }

})();
