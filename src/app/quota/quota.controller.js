(function() {
  'use strict';

  angular
    .module('installment')
    .controller('QuotaController', QuotaController);

  /** @ngInject */
  function QuotaController($scope, $state, $stateParams, $ionicLoading, $location, $timeout, $log, OPENID, utils, userService, NonoWebApi, localStorageService) {
    /**** countdown ****/
    var el_h1 = document.querySelector('#h1'),
        el_h2 = document.querySelector('#h2'),
        el_m1 = document.querySelector('#m1'),
        el_m2 = document.querySelector('#m2'),
        el_s1 = document.querySelector('#s1'),
        el_s2 = document.querySelector('#s2'),
        od_h1 = new Odometer({el: el_h1}),
        od_h2 = new Odometer({el: el_h2}),
        od_m1 = new Odometer({el: el_m1}),
        od_m2 = new Odometer({el: el_m2}),
        od_s1 = new Odometer({el: el_s1}),
        od_s2 = new Odometer({el: el_s2});

    var countdown = function() {
      var parsed = parseTime($scope.countdown);
      od_h1.update(Math.min(parsed.h1, 9));
      od_h2.update(parsed.h2);
      od_m1.update(parsed.m1);
      od_m2.update(parsed.m2);
      od_s1.update(parsed.s1);
      od_s2.update(parsed.s2);

      if($scope.countdown) {
        $timeout(function() {
          $scope.countdown += -1;
          countdown();
        }, 1000);
      }
    };

    function parseTime(countdown) {
      if(countdown < 0) countdown = 0;
      var h = Math.floor(countdown/3600),
          m = Math.floor((countdown-3600*h)/60),
          s = Math.floor(countdown%60);

      return {
        h1: Math.floor(h/10),
        h2: h%10,
        m1: Math.floor(m/10),
        m2: m%10,
        s1: Math.floor(s/10),
        s2: s%10
      };
    }

    var init = function() {
      var lastApplyTime = localStorageService.get('lastApplyTime'),
          lastApplyMoment = lastApplyTime && moment(lastApplyTime),
          currentMoment = moment(),
          quotaMoment = moment().hour(17).minute(0).second(0),
          lastQuotadiff = lastApplyMoment && lastApplyMoment.diff(quotaMoment, 'hours', true),
          currentQuotaDiff = currentMoment.diff(quotaMoment, 'hours', true);

      if(lastQuotadiff < -24) { // can apply

      } else if(lastQuotadiff < 0) {
        if(currentQuotaDiff < 0) {
          $scope.countdown = Math.floor(Math.abs(currentQuotaDiff)*3600);
          countdown();
        } else { // can apply

        }
      } else if(lastApplyTime) {
        $scope.countdown = Math.floor(24 - currentQuotaDiff)*3600;
        countdown();
      }

      $log.debug('countdown', $scope.countdown);
    };

    $scope.apply = function() {
      $ionicLoading.show();
      NonoWebApi.studentApply().success(function(data) {
        if(+data.result === 1) {
          userService.setQuotaStatus('passed');
          utils.alert({
            title: '恭喜您抢到如意分期名额~',
            okText: '马上去完善个人信息~',
            callback: function() {
              $state.go('contact');
            }
          });
        } else {
          userService.setQuotaStatus('failed');
          localStorageService.add('lastApplyTime', moment().format('YYYY-MM-DD hh-mm-ss'));
          utils.alert({
            title: '今日名额已满',
            content: '童鞋可明日再来~',
            callback: function() {
              init();
            }
          });
        }
      });
    };

    // init
    init();
  }
})();
