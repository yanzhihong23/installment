(function() {
  'use strict';

  angular
    .module('installment')
    .controller('IdController', IdController);

  /** @ngInject */
  function IdController($scope, $rootScope, $state, $stateParams, $ionicLoading, $ionicPopup, $log, utils, userService, NonoWebApi, reAuditService, MSApi, md5) {
  	var frontPopup, 
  			holdPopup, 
        passwordPopup, 
  			authSuc = false, 
  			failCounter = 0, 
  			user = userService.getUser(),
        sessionId = userService.getSessionId();

  	$scope.file = {};

  	$scope.$watch('file.front', function (newVal) {
      if (newVal) {
      	$log.debug(newVal);

      	frontPopup && frontPopup.close();

        $rootScope.$on('front', function(evt, data){
          var params = {
            idNo: user.idNo,
            phone: user.phone,
            file: data,
            filename: newVal.filename
          };

          $ionicLoading.show();
          NonoWebApi.uploadCertPhoto(params).success(function(data) {
            if(+data.result === 1) {
              $log.info('cert photo auth success');

              authSuc = true;
              $scope.file.front.uploaded = true;
            } else if(+data.result === 2) {
              failCounter = 2;
              $log.info('cert photo auth failed twice');
            } else {
              $scope.file = {};
              utils.alert({content: data.message});
            }
          }).error(function(data) {
            $log.error('upload cert photo fail');
          });
        });

        // resize image
        utils.resizeImg(newVal, 'front');
      }
    });

    $scope.submit = function() {
    	if(authSuc) {
        if($stateParams.update) { // reaudit process
          reAuditService.processDone('id');
        } else {
          $state.go('video');
        }
    	} else {
    		$scope.file = {};

    		if(failCounter === 2) {
    			utils.alert({
            content: '审核未通过已达2次！您的申请将转由人工审核。如审核通过，将于1-3个工作日内短信通知您',
            callback: function() {
              $state.go('video');
            }
          });
    		} else {
          utils.alert({
            title: 'sorry，身份信息异常！',
            content: '请重新拍照并上传照片'
          });
        }
    	}
    };
  }
})();
