(function() {
  'use strict';

  angular
    .module('installment')
    .service('bankService', bankService);

    /** @ngInject */
    function bankService(localStorageService, userService, MSApi, $log) {
      var self = this;

      this.bankList = localStorageService.get('bankList');
      this.selected = {};

      this.select = function(index) {
        var bank = self.bankList[index];
        self.selected.name = bank.name;
        self.selected.id = bank.id;
      };

      this.getBankList = function() {
        return localStorageService.get('bankList') || [];
      };

      this.updateBankList = function() {
        var sessionId = userService.getSessionId();
        MSApi.getBankListForKQ({sessionId: sessionId})
          .success(function(data) {
            if(data.flag === 1) {
              $log.info('get bank list success');
              self.bankList = data.data.map(function(obj) {
                return {
                  name: obj.name,
                  id: obj.id
                };
              });

              localStorageService.add('bankList', self.bankList);
            }
          });
      };

      if(!this.bankList || !this.bankList.length) {
        this.updateBankList();
      }
    }
})();