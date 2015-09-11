(function() {
  'use strict';

  angular
    .module('installment')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/?openId&orderId&mock',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
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
      .state('payPassword:forgot', {
        url: '/pay.forgot?phone',
        templateUrl: 'app/password/pay.forgot.html',
        controller: 'PayPasswordController'
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
        url: '/id?update',
        templateUrl: 'app/id/id.html',
        controller: 'IdController'
      })
      .state('download', {
        url: '/download',
        templateUrl: 'app/download/download.html',
        controller: 'DownloadController'
      })
      .state('contact', {
        url: '/contact?update',
        templateUrl: 'app/contact/contact.html',
        controller: 'ContactController'
      })
      .state('provinces', {
        url: '/provinces',
        templateUrl: 'app/contact/provinces.html',
        controller: 'ProvinceController'
      })
      .state('citys', {
        url: '/citys',
        templateUrl: 'app/contact/citys.html',
        controller: 'CityController'
      })
      .state('video', {
        url: '/video',
        templateUrl: 'app/video/video.html',
        controller: 'VideoController'
      })
      .state('video:fail', {
        url: '/video:fail',
        templateUrl: 'app/video/video.fail.html',
        controller: 'VideoFailController'
      })
      .state('audit', {
        url: '/audit',
        templateUrl: 'app/audit/audit.html',
        controller: 'AuditController'
      })
      .state('audit:pass', {
        url: '/audit:pass',
        templateUrl: 'app/audit/audit.pass.html',
        controller: 'AuditPassController'
      })
      .state('sign', {
        url: '/sign',
        templateUrl: 'app/sign/sign.html'
      })
      .state('faq', {
        url: '/faq',
        templateUrl: 'app/faq/faq.html'
      })
      .state('quota', {
        url: '/quota',
        templateUrl: 'app/quota/quota.html',
        controller: 'QuotaController'
      })
      .state('order', {
        url: '/order',
        templateUrl: 'app/order/order.html',
        controller: 'OrderController'
      })

    $urlRouterProvider.otherwise('/');
  }

})();
