(function() {
  'use strict';

  angular
    .module('installment')
    .controller('ContactController', ContactController)
    .controller('ProvinceController', ProvinceController)
    .controller('CityController', CityController);

  /** @ngInject */
  function ContactController($scope, $rootScope, $state, $stateParams, $ionicActionSheet, $ionicPopup, $ionicLoading, $log, NonoWebApi, MSApi, localStorageService, userService, addressService, reAuditService, utils, md5) {
    $scope.coach = {};
    $scope.parent = {};
    $scope.friend = {};
  	$scope.address = addressService.selected;
    $scope.doLogin = $scope.doRegister = false;

    var coachPopup, parentPopup, friendPopup, addressPopup;

    /******** coach popup block start ********/
    $scope.showCoachPopup = function() {
      coachPopup = $ionicPopup.show({
        title: '辅导员联系方式',
        templateUrl: 'app/contact/coach.popup.html',
        scope: $scope,
        cssClass: 'popup-large'
      });
    };

    // coach poup submit
    $scope.submitCoach = function() {
      $scope.showCoachInfo = true;
      coachPopup.close();
    };
    /******** coach popup block end ********/


    /******** parent popup block start ********/
    $scope.showParentPopup = function() {
      parentPopup = $ionicPopup.show({
        title: '父母联系方式',
        templateUrl: 'app/contact/parent.popup.html',
        scope: $scope,
        cssClass: 'popup-large'
      });
    };

    // parent poup submit
    $scope.submitParent = function() {
      $scope.showParentInfo = true;
      parentPopup.close();
    };
    /******** parent popup block end ********/


    /******** friend popup block start ********/
    $scope.showFriendPopup = function() {
      friendPopup = $ionicPopup.show({
        title: '好友联系方式',
        templateUrl: 'app/contact/friend.popup.html',
        scope: $scope,
        cssClass: 'popup-large'
      });
    };
    // friend poup submit
    $scope.submitFriend = function() {
      $scope.showFriendInfo = true;
      friendPopup.close();
    };
     /******** friend popup block end ********/


    /******** address popup block start ********/
    $scope.showAddressPopup = function() {
      addressPopup = $ionicPopup.show({
        title: '家庭住址',
        templateUrl: 'app/contact/address.popup.html',
        scope: $scope,
        cssClass: 'popup-large'
      });
    };
    // address poup submit
    $scope.submitAddress = function() {
      $scope.showAddressInfo = true;
      addressPopup.close();
    };
    /******** address popup block end ********/

    $scope.selectProvince = function() {
      addressPopup.close();

      $state.go('provinces');
    };

    $scope.selectCity = function() {
      if($scope.address.province) {
        addressPopup.close();

        $state.go('citys');
      }
    };

    // save contact info
    $scope.submitContactInfo = function() {
      $ionicLoading.show();
      var params = {
        sessionId: userService.getSessionId(),
        coach: $scope.coach,
        parent: $scope.parent,
        friend: $scope.friend,
        address: $scope.address
      };

      MSApi.saveContactInfo(params).success(function(data) {
        if(data.flag === 5) {
          if($stateParams.update) { // reaudit process
            reAuditService.processDone('contact');
          } else {
            $state.go('card');
          }
        } else {
          utils.alert({content: data.msg});
        }
      });
    };

    // show address popup after back from selecte province or city
    $rootScope.$on('addressSelected', function() {
      $scope.showAddressPopup();
    });

    MSApi.getContactInfo({sessionId: userService.getSessionId()})
      .success(function(data) {
        if(data.flag === 3) {
          var info = data.data;

          if(!info) return;
          // coach info
          $scope.coach.name = info.counselor;
          $scope.coach.phone = info.counselor_mobile;
          if(info.counselor || info.counselor_mobile) {
            $scope.showCoachInfo = true;
          }
          // parent info
          $scope.parent.name = info.parent;
          $scope.parent.phone = info.parent_mobile;
          if(info.parent || info.parent_mobile) {
            $scope.showParentInfo = true;
          }
          // friend info
          $scope.friend.name = info.student1;
          $scope.friend.phone = info.student1_mobile;
          if(info.student1 || info.student1_mobile) {
            $scope.showFriendInfo = true;
          }
          // address info
          if(info.home_address) {
            $scope.showAddressInfo = true;
            var address = info.home_address;
            if(address.indexOf('市') !== address.lastIndexOf('市')) {
              $scope.address.province = address.substr(0, address.indexOf('市') + 1);
            } else {
              $scope.address.province = address.substr(0, address.indexOf('省') + 1);
            }

            $scope.address.city = address.substr($scope.address.province.length, address.lastIndexOf('市') + 1 - $scope.address.province.length);
            $scope.address.street = address.substr(address.lastIndexOf('市') + 1);
          }

        }
      })
  }

  /** @ngInject */
  function ProvinceController($scope, $rootScope, addressService, utils) {
    $scope.items = addressService.provinceList;
    $scope.selectProvince = function(index) {
      addressService.selectProvince(index);
      $rootScope.$broadcast('addressSelected');
      utils.goBack();
    };
  }

  /** @ngInject */
  function CityController($scope, $rootScope, addressService, utils) {
    $scope.items = addressService.cityList;
    $scope.selectCity = function(index) {
      addressService.selectCity(index);
      $rootScope.$broadcast('addressSelected');
      utils.goBack();
    };
  }
})();
