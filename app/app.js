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
  'lyonRewards.signup',
  'lyonRewards.dashboard'
]);

// Configuration
app.config(function ($routeProvider, cfpLoadingBarProvider, $httpProvider) {
  cfpLoadingBarProvider.latencyThreshold = 0;
  $routeProvider
      .when('/', {redirectTo: '/home'})
      .otherwise({redirectTo: '/home'}); // TODO Change this line to display 404

  // TODO remove when production is done
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

// Run
app.run(function($rootScope, amMoment) {
  amMoment.changeLocale('fr', null);
});

app.controller('MainMenuCtrl', function($log) {
  
});
