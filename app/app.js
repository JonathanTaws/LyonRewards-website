'use strict';

// Declare app level module which depends on views, and components
angular.module('lyonRewards', [
  'ngRoute',
  'lyonRewards.view1',
  'lyonRewards.view2',
  'lyonRewards.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
