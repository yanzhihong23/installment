(function() {
  'use strict';

  angular
    .module('installment')
    .controller('DownloadController', DownloadController);

  /** @ngInject */
  function DownloadController($scope, $log) {
  	var bridge;

    if(window.WebViewJavascriptBridge) {
    	bridge = WebViewJavascriptBridge;
    } else {
    	document.addEventListener('WebViewJavascriptBridgeReady', function() {
    		bridge = WebViewJavascriptBridge;
    	}, false);
    }

    $scope.downloadIos = function() {
    	if(bridge) {
    		$log.info('downloadApp');
    		bridge.callHandler('downloadApp', {'foo': 'bar'}, function(response) {
    			$log.info('downloadApp responsed');
    		});
    	} else {
    		$log.info('no js bridge');
    	}
    };

    $scope.downloadAndroid = function() {
			if(window.download) {
    		window.download.downloadApp();
    	}
    };
  }
})();
