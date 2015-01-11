'use strict';

angular.module('PiLab.pilab', [ 'ngRoute' ])

.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/pilab', {
		templateUrl : 'pilabView/pilab.html',
		controller : 'PiLabCtrl'
	});
} ])

.controller('PiLabCtrl', [ '$scope', function($scope) {

	
	
	
} ]);