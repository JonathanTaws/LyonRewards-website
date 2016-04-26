'use strict';

// Declare app level module which depends on views, and components
angular.module('lyonRewards', [
  'ngRoute',
  'ngAnimate',
  'angular-loading-bar',
  'lyonRewards.home',
  'lyonRewards.concept',
  'lyonRewards.ranking'
]).
config(['$routeProvider', 'cfpLoadingBarProvider', function($routeProvider, cfpLoadingBarProvider) {
  cfpLoadingBarProvider.latencyThreshold = 100;
  $routeProvider
      .when('/', {redirectTo:'/home'})
      .otherwise({redirectTo:'/home'}); // TODO Change to 404
}]);
