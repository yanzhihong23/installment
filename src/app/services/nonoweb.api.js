(function() {
  'use strict';

  angular
    .module('installment')
    .service('NonoWebApi', NonoWebApi);

  /** @ngInject */
  function NonoWebApi($http, $location, md5, utils, APISERVER, ORDER, MERCHANT, PRODUCTID, $log) {
  	var v = 'm.nonobank.com/msapi/' + moment().format('YYYY-MM-DD HH') + Math.floor(moment().minute()/5),
  			vMd5 = md5.createHash(v),
  			headers = {'Authorization': vMd5,'Content-Type': 'application/x-www-form-urlencoded'};

    var OPENID = ORDER.openId,
        ORDERID = ORDER.orderId;

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

    // zeropay
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

    // zeropay
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

    // zeropay
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

    // zeropay
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

    // zeropay
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

    // zeropay
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

    // zeropay
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

    // zeropay
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

    // zeropay
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

    // for test, simulate order submit
    this.submitOrder = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.NONOWEB + '/ruyiFenqi/submitOrder',
        headers: headers,
        data: utils.param({
          request: JSON.stringify({
            openId: obj.openId,
            merchant: MERCHANT,
            productId: PRODUCTID,
            aim: obj.aim,
            orderId: obj.orderId,
            amount: obj.amount,
            expect: obj.expect,
            orderTime: obj.orderTime,
            orderStatus: obj.orderStatus,
            address: obj.address,
            mobile: obj.phone,
            msgKey: md5.createHash(obj.openId + MERCHANT + obj.aim + obj.amount + obj.expect + obj.orderId + PRODUCTID + obj.orderTime + obj.orderStatus + obj.address + obj.phone)
          })
        })
      });
    };

    // use in audit success page
    this.getOrderStauts = function() {
      return $http({
        method: 'POST',
        url: APISERVER.NONOWEB + '/ruyiFenqi/queryOrderStatus',
        headers: headers,
        data: utils.param({
          request: JSON.stringify({
            openId: OPENID,
            merchant: MERCHANT,
            orderId: ORDERID,
            msgKey: md5.createHash(OPENID + MERCHANT + ORDERID)
          })
        })
      });
    };

    // quota limit
    this.studentApply = function() {
      return $http({
        method: 'POST',
        url: APISERVER.NONOWEB + '/ruyiFenqi/studentApply',
        headers: headers,
        data: utils.param({
          request: JSON.stringify({
            openId: OPENID,
            merchant: MERCHANT,
            orderId: ORDERID,
            msgKey: md5.createHash(MERCHANT + OPENID + ORDERID)
          })
        })
      });
    };

    this.flowStatus = function() {
      return $http({
        method: 'POST',
        url: APISERVER.NONOWEB + '/ruyiFenqi/dingwei',
        headers: headers,
        data: utils.param({
          request: JSON.stringify({
            openId: OPENID,
            merchant: MERCHANT,
            orderId: ORDERID,
            msgKey: md5.createHash(OPENID + MERCHANT + ORDERID)
          })
        })
      });
    };

    this.sign = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.NONOWEB + '/ruyiFenqi/queRenShouhuo',
        headers: headers,
        data: utils.param({
          request: JSON.stringify({
            openId: OPENID,
            merchant: MERCHANT,
            orderId: ORDERID,
            type: 1, // 1: confirm, 2: refuse
            paymentPassword: obj.payPassword,
            msgKey: md5.createHash(OPENID + MERCHANT + ORDERID + 1 + obj.payPassword)
          })
        })
      });
    };
  }
})();
