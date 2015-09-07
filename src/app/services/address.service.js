(function() {
  'use strict';

  angular
    .module('installment')
    .service('addressService', addressService);

    /** @ngInject */
    function addressService(localStorageService, MSApi, $log) {
      var self = this;

      this.provinceList = localStorageService.get('provinceList');
      this.selected = {};

      this.selectProvince = function(index) {
        var province = self.provinceList[index];
        self.selected.province = province;

        updateCityList(province);
      };

      this.selectCity = function(index) {
        self.selected.city =self.cityList[index];
      };

      this.getProvinceList = function() {
        return localStorageService.get('provinceList') || [];
      };

      this.getCityList = function() {
        return localStorageService.get('cityList') || [];
      };

      this.updateProvinceList = function() {
        MSApi.getProvinceList()
          .success(function(data) {
            if(data.flag === 1) {
              $log.info('get province list success');
              self.provinceList = data.data.map(function(obj) {
                return obj.province_name;
              });

              localStorageService.add('provinceList', self.provinceList);
            }
          });
      };

      var updateCityList = function(province) {
        MSApi.getCityList({province: province})
          .success(function(data) {
            if(data.flag === 1) {
              self.cityList = data.data.map(function(obj) {
                return obj.city_name;
              });

              self.selected.city = self.cityList[0];
            }
          })
      };

      if(!this.provinceList || !this.provinceList.length) {
        this.updateProvinceList();
      }
    }
})();