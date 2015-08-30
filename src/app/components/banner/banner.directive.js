(function() {
  'use strict';

  angular
    .module('installment')
    .directive('banner', banner)
    .directive('bannerCredit', bannerCredit);

  /** @ngInject */
  function banner() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/banner/banner.html'
    };

    return directive;
  }

  /** @ngInject */
  function bannerCredit(userService) {
    var directive = {
      restrict: 'E',
      scope: true,
      templateUrl: 'app/components/banner/credit.banner.html',
      link: function(scope, element, attr) {
        var user = userService.getUser();
        scope.credit = user.credit || 200;

        scope.img = angular.isDefined(attr.id) ? 'assets/images/banner-03.png' : 'assets/images/banner-02.png';
      }
    };

    return directive;
  }

})();
