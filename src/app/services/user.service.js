(function() {
  'use strict';

  angular
    .module('installment')
    .service('userService', userService);

    /** @ngInject */
    function userService(localStorageService, MSApi, $timeout, $log) {
      var self = this;

      this.setUser = function(user) {
        localStorageService.add('user', user);
        self.autoLogin();
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


      this.autoLogin = function() {
        var user = self.getUser();
        if(user) {
          var login = function() {
            MSApi.login(user)
              .success(function(data) {
                if(data.flag === 1) {
                  $log.info('auto login suc');
                  self.setSessionId(data.data.session_id);
                  self.setMId(data.data.m_id);

                  $timeout(login, 1200000); // 20 min
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