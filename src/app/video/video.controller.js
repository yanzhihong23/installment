(function() {
  'use strict';

  angular
    .module('installment')
    .controller('VideoController', VideoController)
    .controller('VideoFailController', VideoFailController);

  /** @ngInject */
  function VideoController($scope, userService, $log) {
		var bridge, sessionId = userService.getSessionId();

	  if(window.WebViewJavascriptBridge) {
	  	bridge = WebViewJavascriptBridge;
	  } else {
	  	document.addEventListener('WebViewJavascriptBridgeReady', function() {
	  		bridge = WebViewJavascriptBridge;
	  	}, false);
	  }

	  $scope.videoSign = function() {
	  	if(bridge) {
	  		bridge.callHandler('videoSign', {'sessionId': sessionId}, function(response) {
	  			$log.info('videoSign response');
	  		});
	  	} else {
	  		$log.info('no js bridge');
	  	}
	  };
  }

  /** @ngInject */
  function VideoFailController($scope, $state, $ionicLoading, $log, utils, userService, MSApi, reAuditService) {
  	var sessionId = userService.getSessionId();

  	$scope.reasons = [];

  	$ionicLoading.show();
  	MSApi.afterApplyInfo({sessionId: sessionId})
  		.success(function(data) {
  			if(data.flag === 16) {
  				var msg = data.data.suggestion,
  						startIndex = msg.lastIndexOf('回退：') + 3,
  						endIndex = msg.lastIndexOf('##'),
  						type = '##ABC';
					if(endIndex < 0) {
						endIndex = msg.length;
					} else {
						type = msg.substr(endIndex);
					}

					typeCheck(type);

  				var arr = msg.substr(startIndex, endIndex - startIndex).split('\n');

  				$scope.reasons = arr.filter(function(obj) {
  					return obj.length;
  				});
  			}
  		});

		var typeCheck = function(type) {
			if(/A/.test(type)) {
				$scope.showContact = true;
				reAuditService.processes.push('contact');
			}

			if(/B/.test(type)) {
				$scope.showID = true;
				reAuditService.processes.push('id');
			}

			if(/C/.test(type)) {
				$scope.showVideo = true;
				reAuditService.processes.push('video');
			}
		};

		$scope.changeContact = function() {
			$state.go('contact', {update: true});
		};

		$scope.reUploadId = function() {
			$state.go('id', {update: true});
		};

		$scope.reRecordVideo = function() {
			$state.go('video');
		};
  }
})();
