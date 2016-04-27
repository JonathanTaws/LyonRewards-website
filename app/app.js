'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('lyonRewards', [
  'ngRoute',
  'ngAnimate',
  'ngTouch',
  'angular-loading-bar',
  'ui.bootstrap',
  'http-auth-interceptor',
  'lyonRewards.home',
  'lyonRewards.concept',
  'lyonRewards.ranking',
  'lyonRewards.login',
  'lyonRewards.signup'
]);

// Configuration
app.config(['$routeProvider', 'cfpLoadingBarProvider', function ($routeProvider, cfpLoadingBarProvider) {
  cfpLoadingBarProvider.latencyThreshold = 0;
  $routeProvider
      .when('/', {redirectTo: '/home'})
      .otherwise({redirectTo: '/home'}); // TODO Change to 404
}]);

// Run
app.run(['$rootScope', function(rootScope) {

  // Menu Collapse
  rootScope.isMenuCollapsed = true;

}]);