(function() {
  'use strict';

  angular
    .module('installment')
    .filter('phone', function() {
    	return function(number) {
    		if(isNaN(number)) {
    			return '';
    		} else {
    			number += '';
    			return number.substr(0,3) + '****' + number.substr(-4);
    		}
    	};
    })
    .filter('idEncryptor', function() {
      return function(number) {
        if(isNaN(number)) {
          return '';
        } else {
          number += '';
          return number.substr(0,6) + '********' + number.substr(-4);
        }
      };
    })
    .filter('tailNo', function() {
      return function(number) {
        if(isNaN(number)) {
          return '';
        } else {
          number += '';
          return number.substr(-4);
        }
      };
    })
    .filter('moment', function() {
    	return function(date, token) {
    		return moment(date).format(token);
    	};
    });
})();