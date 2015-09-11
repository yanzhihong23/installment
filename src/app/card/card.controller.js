(function() {
  'use strict';

  angular
    .module('installment')
    .controller('CardController', CardController)
    .controller('BankController', BankController);

  /** @ngInject */
  function CardController($scope, $rootScope, $state, $ionicLoading, $ionicPopup, $ionicModal, $log, userService, bankService, MSApi, NonoWebApi, utils, md5) {
    var user = userService.getUser(),
        sessionId = userService.getSessionId(),
        mId = userService.getMId(),
        resendCountdown = utils.resendCountdown($scope),
        payTosModal,
        addCardPopup,
        phoneAuthPopup,
        passwordPopup,
        params = {
          sessionId: sessionId,
          realname: user.realname,
          idNo: user.idNo,
          mId: mId,
          idType: 0,
          count: 1,
          key: null,
          type: null,
          payCode: 2,
          payMode: 1
        };

    $scope.user = {
      realname: user.realname,
      idNo: user.idNo
    };

    $scope.bank = bankService.selected;
    $scope.card = {};

    $ionicModal.fromTemplateUrl('app/card/pay.tos.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      payTosModal = modal;
    });

  	$scope.showAddCardPopup = function() {
      addCardPopup = $ionicPopup.show({
        title: '银行卡信息',
        templateUrl: 'app/card/card.popup.html',
        scope: $scope,
        cssClass: 'popup-large'
      });
    };

    $scope.showPayTosModal = function() {
      payTosModal.show();
    };

    $scope.closePayTosModal = function() {
      payTosModal.hide();
    };

    $scope.showPhoneAuthPopup = function() {
      if(!$scope.card.cardNo || !$scope.bank.name) {
        utils.alert({content: '请先添加银行卡信息'});
        return;
      }

      phoneAuthPopup = $ionicPopup.show({
        title: '手机验证',
        templateUrl: 'app/card/phone.popup.html',
        scope: $scope,
        cssClass: 'popup-large'
      });
    };

    $scope.sendVcode = function() {
      $ionicLoading.show();
      MSApi.generateOrderNo({sessionId:sessionId}).success(function(data) {
        if(data.flag === 1) {
          params.extRefNo = data.data;
          params.bankCardNo = $scope.card.cardNo;
          params.mobile = $scope.card.phone;

          $ionicLoading.show();
          MSApi.getPayVcode(params).success(function(data) {
            if(data.flag === 1) {
              resendCountdown();

              params.storablePan = data.storablePan;
              params.token = data.token;
              params.bankCode = $scope.bank.id;
            } else {
              phoneAuthPopup.close();
              utils.alert({
                content: data.msg
              });
            }
          })
        }
      })
    };

    $scope.selectBank = function() {
      addCardPopup.close();
      $state.go('banks');
    };

    // card popup
    $scope.submitBank = function() {
      addCardPopup.close();
    };

    // phone popup
    $scope.submitPhone = function() {
      phoneAuthPopup.close();
    };

    // bind card
    $scope.submit = function() {
      $ionicLoading.show();
      params.vcode = $scope.card.vcode;
      MSApi.bindAndPay(params).success(function(data) {
        if(data.flag === 1) {
          $state.go('id');
        } else {
          utils.alert({
            title: 'sorry，还款卡绑定失败！',
            content: data.msg,
            okText: '我知道了'
          });
        }
      });
    };

    $rootScope.$on('bankSelected', function() {
      $scope.showAddCardPopup();
    });
  } // CardController end


  function BankController($scope, $rootScope, bankService, utils) {
    $scope.items = bankService.getBankList();

    $scope.select = function(index) {
      bankService.select(index);
      $rootScope.$broadcast('bankSelected');
      utils.goBack();
    };
  }
})();
