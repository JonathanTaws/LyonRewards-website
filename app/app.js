'use strict';

// Declare app level module which depends on views, and components
angular.module('lyonRewards', [
  'ngRoute',
  'ngAnimate',
  'angular-loading-bar',
  'lyonRewards.view1',
  'lyonRewards.view2',
  'lyonRewards.version'
]).
config(['$routeProvider', 'cfpLoadingBarProvider', function($routeProvider, cfpLoadingBarProvider) {
  cfpLoadingBarProvider.latencyThreshold = 0;
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
