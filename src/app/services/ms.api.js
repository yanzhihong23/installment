(function() {
  'use strict';

  angular
    .module('installment')
    .service('MSApi', MSApi);

  /** @ngInject */
  function MSApi($http, md5, utils, APISERVER) {
  	var v = 'm.nonobank.com/msapi/'+ utils.getDate(),
  			vMd5 = md5.createHash(v),
  			headers = {'Authorization': vMd5,'Content-Type': 'application/x-www-form-urlencoded'};

    // not used
  	this.sendSms = function(obj) {
  		return $http({
  			method: 'POST',
  			url: APISERVER.MSAPI + '/user/sendMessage',
  			headers: headers,
  			data: utils.param({
  				phone: obj.phone
  			})
  		});
  	};

  	this.login = function(obj) {
  		return $http({
  			method: 'POST',
  			url: APISERVER.MSAPI + '/user/login',
  			headers: headers,
  			data: utils.param({
  				username: obj.phone,
  				password: obj.password
  			})
  		});
  	};

    // not used
  	this.logout = function(obj) {
  		return $http({
  			method: 'POST',
  			url: APISERVER.MSAPI + '/user/logout',
  			headers: headers,
  			data: utils.param({
  				sessionId: obj.sessionId
  			})
  		});
  	};

    // not used
  	this.register = function(obj) {
  		return $http({
  			method: 'POST',
  			url: APISERVER.MSAPI + '/user/register',
  			headers: headers,
  			data: utils.param({
  				mobile: obj.mobile,
  				validatemobile: obj.vcode,
  				password: obj.password,
  				sessionId: obj.sessionId,
  				borrowtype: obj.borrowtype || '理财',
  				approach: obj.approach || 'dfd',
  				am_id: obj.amId || 'dfd'
  			})
  		});
  	};

  	this.studentCodeAuth = function(obj) {
  		return $http({
  			method: 'POST',
  			url: APISERVER.MSAPI + '/student/educationVerfiy',
  			headers: headers,
  			data: utils.param({
  				sessionId: obj.sessionId,
  				valid_education: obj.code
  			})
  		});
  	};

  	this.sendSmsForRetrievePassword = function(obj) {
			return $http({
				method: 'POST',
				url: APISERVER.MSAPI + '/user/sendValidateMobile',
				headers: headers,
				data: utils.param({
					mobilenum: obj.phone
				})
			});
		};

		this.findPassword = function(obj) {
			return $http({
				method: 'POST',
				url: APISERVER.MSAPI + '/user/findPassword',
				headers: headers,
				data: utils.param({
					mobilenum: obj.phone,
					validation: obj.vcode,
					idCard: obj.idNo
				})
			});
		};

		this.changeFindPassword = function(obj) {
			return $http({
				method: 'POST',
				url: APISERVER.MSAPI + '/user/changeFindPassword',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId,
					password: obj.password
				})
			});
		};

    this.getBankListForKQ = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.MSAPI + '/bank/getBankListForKQ',
        headers: headers,
        data: utils.param({
          sessionId: obj.sessionId
        })
      });
    };

    this.generateOrderNo = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.MSAPI + '/user/generateKQMobileOrderNo',
        headers: headers,
        data: utils.param({
          sessionId: obj.sessionId
        })
      });
    };

    // vcode for bind and pay
    this.getPayVcode = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.MSAPI + '/quickBill/getDynTr2',
        headers: headers,
        data: utils.param({
          externalRefNumber: obj.extRefNo,
          realname: obj.realname,
          idno: obj.idNo,
          idType: obj.idType || 0, // 0: default
          m_id: obj.mId,
          bankCardNo: obj.bankCardNo,
          mobile: obj.mobile,
          count: obj.count,
          key: obj.key, // product id
          type: obj.type, //product type
          paycode: obj.payCode, // 1: buy, 2: repayment/recharge
          payMode: obj.payMode // 1: bank, 2: balance， 3: combo
        })
      });
    };

    // bind and pay
    this.bindAndPay = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.MSAPI + '/quickBill/doPay',
        headers: headers,
        data: utils.param({
          m_id: obj.mId,
          sessionId: obj.sessionId,
          externalRefNumber: obj.extRefNo,
          storablePan: obj.storablePan,
          count: obj.count,
          validCode: obj.vcode || '',
          token: obj.token,
          payMode: obj.payMode,
          key: obj.key,
          type: obj.type,
          realname: obj.realname,
          idno: obj.idNo,
          bankCardNo: obj.bankCardNo,
          bankcode: obj.bankCode,
          mobile: obj.mobile,
          paycode: obj.payCode,
          coupon: obj.coupon || '', // uv_code:uv_id:value
          interest: obj.interest || ''
        })
      })
    };

    this.setPayPassword = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.MSAPI + '/user/savePayPassword',
        headers: headers,
        data: utils.param({
          sessionId: obj.sessionId,
          newZFPwd: obj.payPassword
        })
      });
    };


  }
})();
