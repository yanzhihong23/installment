(function() {
  'use strict';

  angular
    .module('installment')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/?openId',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('phone', {
        url: '/phone',
        templateUrl: 'app/phone/phone.html',
        controller: 'PhoneController'
      })
      .state('login', {
        url: '/login?phone',
        templateUrl: 'app/login/login.html',
        controller: 'LoginController'
      })
      .state('register', {
        url: '/register?phone',
        templateUrl: 'app/register/register.html',
        controller: 'RegisterController'
      })
      .state('register:suc', {
        url: '/register:suc',
        templateUrl: 'app/register/register.suc.html',
        controller: 'RegisterController'
      })
      .state('password:forgot', {
        url: '/forgot?phone',
        templateUrl: 'app/password/forgot.html',
        controller: 'PasswordController'
      })
      .state('password:reset', {
        url: '/reset?phone',
        templateUrl: 'app/password/reset.html',
        controller: 'ResetPasswordController'
      })
      .state('studentAuth', {
        url: '/studentAuth',
        templateUrl: 'app/student/student.html',
        controller: 'StudentAuthController'
      })
      .state('studentAuth:fail', {
        url: '/studentAuth:fail',
        templateUrl: 'app/student/fail.html',
        controller: 'StudentAuthFailController'
      })
      .state('card', {
        url: '/card',
        templateUrl: 'app/card/card.html',
        controller: 'CardController'
      })
      .state('banks', {
        url: '/banks',
        templateUrl: 'app/card/banks.html',
        controller: 'BankController'
      })
      .state('id', {
        url: '/id',
        templateUrl: 'app/id/id.html',
        controller: 'IdController'
      })
      .state('account', {
        url: '/account',
        templateUrl: 'app/account/account.html',
        controller: 'AccountController'
      })
      .state('bills', {
        url: '/bills',
        templateUrl: 'app/bills/bills.html',
        controller: 'BillsController'
      })
      .state('download', {
        url: '/download',
        templateUrl: 'app/download/download.html',
        controller: 'DownloadController'
      })

    $urlRouterProvider.otherwise('/');
  }

})();
