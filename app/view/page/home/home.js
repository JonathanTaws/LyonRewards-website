'use strict';

var appPageHome = angular.module('lyonRewards.home', [
  'ngRoute',
  'angularMoment',
  'uiGmapgoogle-maps',
  'angular.filter'
]);

appPageHome.config(function($routeProvider, uiGmapGoogleMapApiProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'view/page/home/home.html',
    controller: 'HomeCtrl'
  });

  // Google Map init SDK JavaScript
  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyAb6hZTjcu4AsMj-J5L4WTWWHz7m-MOpUQ',
    v: '3', //defaults to latest 3.X anyhow
    libraries: 'weather,geometry,visualization'
  });
});

appPageHome.controller('HomeCtrl', function($scope, $http) {

  $scope.events = [];
  var loader = jQuery('.home .loader-container');
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

appPageHome.controller('EventCtrl', function($scope, $log, $timeout) {

  $scope.isCollapsed = true;
  $scope.isVisible = false;

  $scope.toggle = function() {
    $timeout(function() {
      $scope.isVisible = !$scope.isVisible;
    }, 500);
    $scope.isCollapsed = !$scope.isCollapsed;
  };

  $scope.map = {
    center: {
      latitude: $scope.event.latitude,
      longitude: $scope.event.longitude
    },
    zoom: 11
  };

});

appPageHome.controller('EventsInfoCtrl', function($scope, $log, $timeout){

  $scope.currentEvents = [];

  $scope.$watch('events', function () {
    var now = new Date();
    angular.forEach($scope.events, function(value) {
      if (new Date(value.end_date) >= now) {
        $scope.currentEvents.push(value);
      }
    });
  });

  $scope.isCollapsed = true;
  $scope.isVisible = false;

  $scope.toggle = function() {
    $timeout(function() {
      $scope.isVisible = !$scope.isVisible;
    }, 500);
    $scope.isCollapsed = !$scope.isCollapsed;
  };

  // Maps center on Lyon
  $scope.map = {
    center: {
      latitude: 45.7663357,
      longitude: 4.8559309
    },
    zoom: 13
  };


});