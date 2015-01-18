'use strict';

angular.module('PiLab.pilab', [ 'ngRoute' ])

.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/pilab', {
		templateUrl : 'pilabView/pilab.html',
		controller : 'PiLabCtrl'
	});
} ])

.controller('PiLabCtrl', [ '$scope', function($scope) {
	console.log("PiLabCtrl... ");
	var socket = io(remoteAddress);

	socket.on("move", function(msg) {

		console.log("On move... " + msg.turn);

		$scope.msg = " client connected from: IP " + msg.ip + " | data:" + msg.turn;

		if (msg.turn < 0.1) {
			$scope.left = {
				'opacity' : msg.turn * -0.01
			};
		} else {
			$scope.left = {
				'opacity' : '0'
			};
		}

		if (msg.turn > 0.1) {
			$scope.right = {
				'opacity' : msg.turn * 0.01
			};
		} else {
			$scope.right = {
				'opacity' : '0'
			};
		}

		$scope.logoStyle = {
			'transform-style' : 'preserve-3d',
			'-webkit-transform' : 'rotateZ(' + msg.turn + 'deg)',
			'-moz-transform' : 'rotateZ(' + msg.turn + 'deg)',
			'-ms-transform' : 'rotateZ(' + msg.turn + 'deg)',
			'-o-transform' : 'rotateZ(' + msg.turn + 'deg)',
			'transform' : 'rotateZ(' + msg.turn + 'deg)'

		};
		$scope.$apply();

	});

} ]);
