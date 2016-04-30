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

appPageHome.controller('HomeCtrl', function($scope, $http, $log) {

  $scope.eventsOrderBy = '-end_date';

  $scope.events = [];
  var loader = jQuery('.home .loader-container');
  var events = jQuery('.home .events');
  events.fadeOut(0);

  var displayEvents = function() {
    loader.hide();
    events.fadeIn(500);
  };

  var eventsSuccessCallback = function(response) {
    $scope.events = response.data;
    displayEvents();
  };

  var eventsErrorCallback = function(response) {
    displayEvents();
  };

  $http.get('https://lyonrewards.antoine-chabert.fr/api/events', {responseType: 'json'}).then(eventsSuccessCallback, eventsErrorCallback);


  // Get tags
  $scope.tags = [];

  var tagsSuccessCallback = function(response) {
    $scope.tags = response.data;
  };

  var tagsErrorCallback = function(response) {
    $log.error('Impossible to get all tags');
  };
  $http.get('https://lyonrewards.antoine-chabert.fr/api/tags', {responseType: 'json'}).then(tagsSuccessCallback, tagsErrorCallback);

  $scope.getTag = function(id) {
    return _.find($scope.tags, function(tag) { return tag.id == id; });
  };
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

  $scope.$watch('eventsOrderBy', function () {
    $scope.$parent.eventsOrderBy = $scope.eventsOrderBy
  });

  $scope.$watch('eventsQuery', function () {
    $scope.$parent.eventsQuery = $scope.eventsQuery
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