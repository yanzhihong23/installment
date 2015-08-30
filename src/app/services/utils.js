(function() {
  'use strict';

  angular
    .module('installment')
    .factory('utils', utils);

  /** @ngInject */
  function utils($ionicHistory, $timeout, $ionicPopup, $log, $rootScope) {
		return {
			getLocationSearch: function() {
				var query_string = {};
				  var query = window.location.search.substring(1);
				  var vars = query.split("&");
				  for (var i=0;i<vars.length;i++) {
				    var pair = vars[i].split("=");
				        // If first entry with this name
				    if (typeof query_string[pair[0]] === "undefined") {
				      query_string[pair[0]] = decodeURIComponent(pair[1]);
				        // If second entry with this name
				    } else if (typeof query_string[pair[0]] === "string") {
				      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
				      query_string[pair[0]] = arr;
				        // If third or later entry with this name
				    } else {
				      query_string[pair[0]].push(decodeURIComponent(pair[1]));
				    }
				  }

			    return query_string;
			},
			param: function(obj) {
				var str = [];
        for(var p in obj) {
        	str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
        
        return str.join("&");
			},
			getDate: function(dateObj) {
				var now = dateObj ? new Date(dateObj) : new Date();
				var year = now.getFullYear();
				var month = now.getMonth() + 1;
				var date = now.getDate();
				var appendZero = function(obj) {
					return (obj < 10 ? '0' : '') + obj;
				};
				
				return year + '-' + appendZero(month) + '-' + appendZero(date);
			},
			addMonth: function(dateObj, num) {
				var currentMonth = dateObj.getMonth();
		    dateObj.setMonth(dateObj.getMonth() + num)

		    if (dateObj.getMonth() != ((currentMonth + num) % 12)){
		        dateObj.setDate(0);
		    }
		    return dateObj;
			},
			disableBack: function() {
				$ionicHistory.nextViewOptions({
				  disableAnimate: false,
				  disableBack: true
				});
			},
			goBack: function(depth) {
				$ionicHistory.goBack(depth);
			},
			resendCountdown: function($scope) {
				$scope.resendCountdown = 0;
				
				return function() {
					$scope.resendCountdown = 60;
					var countdown = function() {
					  if($scope.resendCountdown > 0) {
					    $scope.resendCountdown += -1;
					    $timeout(countdown, 1000);
					  }
					};
					countdown();
				};
			},
			alert: function(obj) {
				var alertPopup = $ionicPopup.alert({
				  title: obj.title || '温馨提示',
				  cssClass: obj.cssClass || 'text-center',
				  subTitle: obj.subTitle || '',
				  template: obj.content || '',
				  templateUrl: obj.contentUrl || '',
				  okText: obj.okText || '确认',
				  okType: obj.okType || 'button-assertive'
				});
				alertPopup.then(function(res) {
					obj.callback && obj.callback();
				});
			},
			confirm: function(obj) {
				var confirmPopup = $ionicPopup.confirm({
				  title: obj.title || '温馨提示',
				  template: obj.content || '',
				  cssClass: obj.cssClass || 'text-center',
				  okText: obj.okText || '确认',
				  okType: obj.okType || 'button-assertive',
				  cancelText: obj.cancelText || '取消'
				});
				confirmPopup.then(function(res) {
					if(res) {
						obj.onOk && obj.onOk();
					} else {
						obj.onCancel && obj.onCancel();
					}
				});
			},
			resizeImg: function(file, eventName) {
				var header = 'data:' + file.filetype + ';base64,',
						src = header + file.base64,
						image = new Image(),
						max_width = 1200,
						max_height = 1200;

				image.onload = function() {
			  	var canvas = document.createElement('canvas');

				  var width = image.width;
				  var height = image.height;

				  // calculate the width and height, constraining the proportions
				  if (width > height) {
				    if (width > max_width) {
				      //height *= max_width / width;
				      height = Math.round(height *= max_width / width);
				      width = max_width;
				    }
				  } else {
				    if (height > max_height) {
				      //width *= max_height / height;
				      width = Math.round(width *= max_height / height);
				      height = max_height;
				    }
				  }

				  // resize the canvas and draw the image data into it
				  canvas.width = width;
				  canvas.height = height;
				  var ctx = canvas.getContext("2d");
				  ctx.drawImage(image, 0, 0, width, height);
				  $log.debug('width', width);
				  $log.debug('height', height);
				  $log.debug('result', canvas.toDataURL(file.filetype, 0.95));

				  var result = canvas.toDataURL(file.filetype, 0.95).substring(header.length);
				  // $log.debug(canvas.toDataURL(file.filetype, 0.7));
				  $log.debug('compress result size', result.length);
				  $log.debug('compress ratio', result.length/file.filesize);

				  $rootScope.$broadcast(eventName, result);

				  // return result;
				};

	      image.src = src;
			}
		}
  }

})();