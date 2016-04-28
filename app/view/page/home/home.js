'use strict';

var appPageHome = angular.module('lyonRewards.home', ['ngRoute', 'angularMoment', 'uiGmapgoogle-maps']);

appPageHome.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'view/page/home/home.html',
    controller: 'HomeCtrl'
  });
}]);

appPageHome.controller('HomeCtrl', function($scope, $http) {

  $scope.events = [];
  var loader = jQuery('.home .loader');
  var events = jQuery('.home .events');
  events.fadeOut(0);

  var displayEvents = function() {
    loader.hide();
    events.fadeIn(500);
  };

  var successCallback = function(response) {
    $scope.events = response.data;
    displayEvents();
  };

  var errorCallback = function(response) {
    displayEvents();
  };

  $http.get('https://lyonrewards.antoine-chabert.fr/api/events', {responseType: 'json'}).then(successCallback, errorCallback);
});

appPageHome.controller('EventCtrl', function($scope, $log) {
  $scope.isCollapsed = true;
  $scope.map = {
    center: {
      latitude: $scope.event.latitude,
      longitude: $scope.event.longitude
    },
    zoom: 11
  };
  $log.debug($scope.map);
});