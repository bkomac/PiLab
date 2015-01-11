'use strict';

// Declare app level module which depends on views, and components
angular.module('PiLab', [ 'ngRoute', 'PiLab.pilab', 'PiLab.version' ])

.config([ '$routeProvider', function($routeProvider) {

	$routeProvider.when('/pilab', {
		templateUrl : 'pilabView/pilab.html',
		controller : 'PiLabCtrl'

	}).otherwise({
		redirectTo : '/pilab'
	});
} ]);
