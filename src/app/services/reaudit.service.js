(function() {
  'use strict';

  angular
    .module('installment')
    .service('reAuditService', reAuditService);

    /** @ngInject */
    function reAuditService($state, $ionicLoading, localStorageService, MSApi, $log, userService, utils) {
      var self = this;

      this.processes = [];

      this.processDone = function(type) {
        var processes = angular.copy(self.processes);

        self.processes.splice(0, self.processes.length);

        processes.map(function(obj) {
          if(obj !== type) {
            self.processes.push(obj);
          }
        });

        if(!self.processes.length) {
          var sessionId = userService.getSessionId();

          $ionicLoading.show();
          MSApi.reAuditApply({sessionId: sessionId})
            .success(function(data) {
              if(data.flag === 1) {
                $state.go('home');
              }
            });
        } else {
          utils.goBack();
        }
      };
    }
})();