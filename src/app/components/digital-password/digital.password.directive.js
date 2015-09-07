(function() {
  'use strict';

  angular
    .module('installment')
    .directive('digitalPassword', digitalPassword);

  /** @ngInject */
  function digitalPassword($timeout) {
    var directive = {
      restrict: 'E',
      require: 'ngModel',
      replace: true,
      templateUrl: 'app/components/digital-password/digital.password.html',
      // scope: true,
      link: function(scope, element, attr, ngModel) {
        scope.$watch('user.payPassword', function(val, old) {
          scope.len = val ? val.length : 0;
        }, true);
      }
    };

    return directive;
  }

})();
