(function() {
  'use strict';

  angular
    .module('installment')
    .service('NonoWebApi', NonoWebApi);

  /** @ngInject */
  function NonoWebApi($http, md5, utils, APISERVER, OPENID, MERCHANT, PRODUCTID, $log) {
  	var v = 'm.nonobank.com/msapi/'+ utils.getDate(),
  			vMd5 = md5.createHash(v),
  			headers = {'Authorization': vMd5,'Content-Type': 'application/x-www-form-urlencoded'};

    var search = utils.getLocationSearch();
    OPENID = search.openId || OPENID;
    $log.info('openId in NonoWebApi', OPENID);

		this.isRegister = function(obj) {
			return $http({
  			method: 'POST',
  			url: APISERVER.NONOWEB + '/creditAuth/isRegister',
  			headers: headers,
  			data: utils.param({
  				request: JSON.stringify({
  					mobile: obj.phone
  				})
  			})
  		});
		};

    this.sendSms = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.NONOWEB + '/creditAuth/getSmsCode',
        headers: headers,
        data: utils.param({
          request: JSON.stringify({
            openId: OPENID,
            merchant: MERCHANT,
            mobile: obj.phone,
            msgKey: md5.createHash(OPENID + MERCHANT + obj.phone)
          })
        })
      });
    };

    this.register = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.NONOWEB + '/creditAuth/verifySmsCode',
        headers: headers,
        data: utils.param({
          request: JSON.stringify({
            openId: OPENID,
            merchant: MERCHANT,
            mobile: obj.phone,
            smsCode: obj.vcode,
            msgKey: md5.createHash(OPENID + MERCHANT + obj.phone + obj.vcode)
          })
        })
      });
    };

		this.isAuthenticatedSchoolRoll = function(obj) {
			return $http({
  			method: 'POST',
  			url: APISERVER.NONOWEB + '/creditAuth/isAuthenticatedSchoolRoll',
  			headers: headers,
  			data: utils.param({
  				request: JSON.stringify({
  					openId: OPENID,
  					merchant: MERCHANT,
  					mobile: obj.phone,
  					msgKey: md5.createHash(OPENID + MERCHANT + obj.phone)
  				})
  			})
  		});
		};

    this.isPaymentActivated = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.NONOWEB + '/creditPayment/isPaymentActivated',
        headers: headers,
        data: utils.param({
          request: JSON.stringify({
            openId: OPENID,
            merchant: MERCHANT,
            msgKey: md5.createHash(OPENID + MERCHANT)
          })
        })
      });
    };

    this.activePayment = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.NONOWEB + '/creditPayment/activatePayment',
        headers: headers,
        data: utils.param({
          request: JSON.stringify({
            openId: OPENID,
            merchant: MERCHANT,
            mobile: obj.phone,
            msgKey: md5.createHash(OPENID + MERCHANT + obj.phone)
          })
        })
      });
    };

    this.getSchoolList = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.NONOWEB + '/creditAccount/getSchoolList',
        headers: headers,
        data: utils.param({
          request: "{}"
        })
      });
    };

    this.authenticateSchoolRoll = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.NONOWEB + '/creditAuth/authenticateSchoolRoll',
        headers: headers,
        data: utils.param({
          request: JSON.stringify({
            openId: OPENID,
            merchant: MERCHANT,
            name: obj.realname,
            certNo: obj.idNo,
            college: obj.school,
            schoolRoll: obj.degree,
            entranceYear: obj.year,
            mobileNum: obj.phone,
            msgKey: md5.createHash(OPENID + MERCHANT + obj.idNo)
          })
        })
      });
    };

    this.uploadCertPhoto = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.NONOWEB + '/creditAuth/uploadCertPhoto',
        headers: headers,
        data: utils.param({
          request: JSON.stringify({
            openId: OPENID,
            merchant: MERCHANT,
            certNo: obj.idNo,
            mobile: obj.phone,
            file: obj.file,
            fileName: obj.filename,
            productId: PRODUCTID,
            msgKey: md5.createHash(OPENID + MERCHANT + obj.idNo + obj.phone)
          })
        })
      });
    };

    this.uploadHoldCertPhoto = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.NONOWEB + '/creditAuth/uploadTakeCertPhoto',
        headers: headers,
        data: utils.param({
          request: JSON.stringify({
            openId: OPENID,
            merchant: MERCHANT,
            mobile: obj.phone,
            file: obj.file,
            fileName: obj.filename,
            msgKey: md5.createHash(OPENID + MERCHANT + obj.phone)
          })
        })
      });
    };

    this.getAccountSummary = function() {
      return $http({
        method: 'POST',
        url: APISERVER.NONOWEB + '/creditPayment/getAccountSummary',
        headers: headers,
        data: utils.param({
          request: JSON.stringify({
            openId: OPENID,
            merchant: MERCHANT,
            msgKey: md5.createHash(OPENID + MERCHANT)
          })
        })
      });
    };

    this.getAvailableCreditLine = function() {
      return $http({
        method: 'POST',
        url: APISERVER.NONOWEB + '/creditPayment/getAvailableCreditLine',
        headers: headers,
        data: utils.param({
          request: JSON.stringify({
            openId: OPENID,
            merchant: MERCHANT,
            msgKey: md5.createHash(OPENID + MERCHANT)
          })
        })
      });
    };

    this.getBillDetail = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.NONOWEB + '/creditPayment/getBillDetail',
        headers: headers,
        data: utils.param({
          request: JSON.stringify({
            openId: OPENID,
            merchant: MERCHANT,
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            msgKey: md5.createHash(OPENID + MERCHANT)
          })
        })
      });
    };

    this.saveActionLog = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.NONOWEB + '/creditAuth/saveActionLog',
        headers: headers,
        data: utils.param({
          request: JSON.stringify({
            userId: obj.userId || '',
            mobileNum: obj.phone,
            productId: PRODUCTID,
            merchantId: MERCHANT,
            actionType: obj.actionType, // 0未操作 1注册 2登录 3学籍认证 4上传身份证 5脸纹认证 6绑卡 7授信激活 8下载APP 9其他操作
            actionResult: obj.actionResult, // 0: fail, 1: success, 2: in process
            remark: obj.remark
          })
        })
      });
    };
  }
})();
