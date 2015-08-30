(function() {
  'use strict';

  angular
    .module('installment')
    .directive('vcode', vcode);

  /** @ngInject */
  function vcode($log, utils) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/vcode/vcode.html',
      replace: true,
      require: 'ngModel',
      link: function(scope, element, attr) {
        var func = utils.resendCountdown(scope);

        scope.$watch('vcode', function(val) {
          var model = attr.ngModel;
          var arr = model.split('.');
          if(arr.length === 1) {
            scope[attr.ngModel] = scope.vcode;
          } else if(arr.length === 2) {
            !scope[arr[0]] && (scope[arr[0]] = {});
            scope[arr[0]][arr[1]] = scope.vcode;
          }
        });

        scope._send = function() {
          attr.send && scope[attr.send]();
          func();
        };
      }
    };

    return directive;
  }

})();
