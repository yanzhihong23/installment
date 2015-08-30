(function() {
  'use strict';

  angular
    .module('installment')
    .directive('idNumber', idNumber);

  /** @ngInject */
  function idNumber($log) {
    var directive = {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attr, ngModel) {
        element.parent().addClass('relative id-number').append('<div class="display"></div>');

        scope.$watch(function() {
          return ngModel.$modelValue;
        }, function(val) {
          $log.debug('input', val);

          var display = val || '';

          if(val && val.length > 14) {
            display = val.substr(0, 6) + ' ' + val.substr(6, 8) + ' ' + val.substr(14);
          } else if(val && val.length > 6) {
            display = val.substr(0, 6) + ' ' + val.substr(6);
          }

          element.parent().find('div').html(display);
        })
      }
    };

    return directive;
  }

})();
