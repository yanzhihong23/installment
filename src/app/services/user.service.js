(function() {
  'use strict';

  angular
    .module('installment')
    .service('userService', userService);

    /** @ngInject */
    function userService(localStorageService, MSApi, $timeout, $log) {
      var self = this;
      var ticker;

      this.setUser = function(user, onlyUpdateUser) {
        localStorageService.add('user', user);
        !onlyUpdateUser && self.autoLogin();
      };

      this.getUser = function() {
        return localStorageService.get('user');
      };

      this.setSessionId = function(sessionId) {
        localStorageService.add('sessionId', sessionId);
      };

      this.getSessionId = function() {
        return localStorageService.get('sessionId');
      };

      this.setMId = function(mId) {
        localStorageService.add('mId', mId);
      };

      this.getMId = function() {
        return localStorageService.get('mId');
      };

      this.setIdAuthFailCounter = function(counter) {
        localStorageService.add('idAuthFailCounter', counter);
      };

      this.getIdAuthFailCounter = function() {
        return localStorageService.get('idAuthFailCounter');
      };

      this.setProcess = function(process) {
        localStorageService.add('process', process);
      };

      this.getProcess = function() {
        return localStorageService.get('process');
      };

      this.setQuotaStatus = function(status) {
        localStorageService.add('quota', status);
      };

      this.getQuotaStatus = function() {
        return localStorageService.get('quota');
      }


      this.autoLogin = function() {
        var user = self.getUser();
        if(user && !ticker) {
          var login = function() {
            MSApi.login(user)
              .success(function(data) {
                if(data.flag === 1) {
                  $log.info('auto login suc');
                  var data = data.data;
                  self.setUser({
                    phone: user.phone,
                    password: user.password,
                    realname: data.realname,
                    idNo: data.idnum,
                    hasPayPassword: !!data.is_pay_password,
                    hasCard: !!data.is_set_bank
                  }, true);
                  self.setSessionId(data.session_id);
                  self.setMId(data.m_id);

                  ticker = $timeout(login, 1200000); // 20 min
                } else {
                  localStorageService.remove('user');
                }
              });
          };

          login();
        }
      };
    }
})();