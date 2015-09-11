(function() {
  'use strict';

  angular
    .module('installment')
    .directive('setPayPassword', setPayPassword);

  /** @ngInject */
  function setPayPassword($ionicPopup, userService, MSApi, $ionicLoading, md5, utils, $log) {
    var directive = {
      restrict: 'E',
      scope: true,
      link: function(scope, element, attr, ngModel) {
        var user = userService.getUser(),
            sessionId = userService.getSessionId(),
            passwordPopup;

        // for pay password popup
        scope.user = {
          notMatch: false
        };

        // check whether password is match
        scope.$watch('user.payPasswordConfirm', function(val) {
          if(val && val.length === 6 && val !== scope.user.payPassword) {
            scope.user.notMatch = true;
          } else {
            scope.user.notMatch = false;
          }
        }, true);

        if(user && !user.hasPayPassword) {
          passwordPopup = $ionicPopup.show({
            title: '设置支付密码',
            subTitle: '用于签收及还款时使用',
            templateUrl: 'app/components/set-pay-password/set.pay.password.html',
            scope: scope,
            cssClass: 'popup-large'
          });
        }

        // pay password popup
        scope.submitPayPassword = function() {
          $ionicLoading.show();
          MSApi.setPayPassword({
            sessionId: sessionId,
            payPassword: md5.createHash(scope.user.payPassword)
          }).success(function(data) {
            passwordPopup.close();
            if(data.flag === 1) {
              utils.alert({
                title: '恭喜您',
                content: '支付密码设置成功',
                callback: function() {
                  // $state.go('account');
                }
              });
            } else {
              $log.error('set pay password failed', data.msg);
              utils.alert({content: data.msg});
            }
          })
        };
      }
    };

    return directive;
  }

})();
