(function() {
  'use strict';

  angular
    .module('installment')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, $state, $stateParams, $ionicLoading, $location, $log, utils, userService, NonoWebApi, ORDER, localStorageService) {
    var search = utils.getLocationSearch();
    if(search.clear) {
      $log.info('clear local storage');
      localStorageService.clearAll();
    }

    $ionicLoading.show();
    var user = userService.getUser();

    if(!user) {
      $state.go('studentAuth');
    } else if(user.openId !== ORDER.openId) {
      localStorageService.remove('user');
      $state.go('studentAuth');
    } else {
      NonoWebApi.flowStatus().success(function(data) {
        if(+data.result === 1) {
          switch(+data.map.dingweiStatus) {
            case 0: // need to do register
            case 1: // need to do student auth
              $state.go('studentAuth');
              break;
            case 2: // need to add contact info
              if(userService.getQuotaStatus() === 'passed') {
                $state.go('contact');
              } else {
                $state.go('quota');
              }
              break;
            case 3: // need to bind bank card
              $state.go('card');
              break;
            case 4: // need to upload id
              $state.go('id');
              break;
            case 6: // need to do video auth
              $state.go('video');
              break;
            case 7: // video auth in progress
              $state.go('audit');
              break;
            case 8: // video auth pass
              $state.go('audit:pass');
              break;
            case 9: // reject
              break;
            case 10:
              $state.go('video:fail');
              break;
          }
        } else {
          utils.alert({content: data.message});
        }
      })
    }
  }
})();
