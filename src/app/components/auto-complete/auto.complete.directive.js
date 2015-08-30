(function() {
  'use strict';

  angular
    .module('installment')
    .directive('autoComplete', autoComplete);

  /** @ngInject */
  function autoComplete($log, $filter, $parse, $timeout) {
    var directive = {
      restrict: 'A',
      // templateUrl: 'app/components/auto-complete/auto.complete.html',
      require:"ngModel",
      link: function(scope, element, attr, ngModel) {
        console.log(attr.ngModel);
        var options, last, isDelete = false;

        scope.$watch(function() {
          return ngModel.$modelValue;
        }, function(modelValue, old) {
          $log.debug('searchText', modelValue);

          var results = $filter('filter')(options, modelValue);
          $log.debug('results', results);

          isDelete = last && last.substr(0, last.length - 1) === modelValue;
          $log.debug('isDelete', isDelete);

          last = modelValue;
          if(results && results.length === 1 && !isDelete) {
            // add timeout to fix ios issue
            $timeout(function() {
              element.val(results[0]);
              last = results[0];
              // ngModel listens for "input" event
              element.triggerHandler('input');
            }, 200);
          }

          $log.debug('last', last);
          $log.debug('modelValue', ngModel.$modelValue);
        });

        scope.$watch(attr.options, function(val) {
          // $log.debug('options', val);
          if(val) options = val;
        });
      }
    };

    return directive;
  }

})();
