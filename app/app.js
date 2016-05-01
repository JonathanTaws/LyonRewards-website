'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('lyonRewards', [
  'ngRoute',
  'ngTouch',
  'angular-loading-bar',
  'ui.bootstrap',
  'http-auth-interceptor',
  'perfect_scrollbar',
  'angular.filter',
  'AngularPrint',
  'duScroll',
  'lyonRewards.home',
  'lyonRewards.concept',
  'lyonRewards.ranking',
  'lyonRewards.offers',
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
app.run(function($rootScope, amMoment, $document) {
  amMoment.changeLocale('fr', null);

  $rootScope.scrollTop = function() {
    $document.scrollTopAnimated(0, 500);
  };
});

app.controller('MainMenuCtrl', function($log) {
  
});
