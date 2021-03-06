'use strict';

var appPageHome = angular.module('lyonRewards.home', [
  'ngRoute',
  'angularMoment',
  'uiGmapgoogle-maps',
  'angular.filter',
  'duScroll',
  'lyonRewards.ranking',
  'lyonRewards.config'
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

appPageHome.controller('HomeCtrl', function($scope, $http, $log, API_URL) {

  $scope.eventsOrderBy = '-start_date';

  $scope.events = [];
  var loader = jQuery('.home-page .loader-container');
  var events = jQuery('.home-page .events');
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

  $http.get(API_URL + '/api/events', {responseType: 'json'}).then(eventsSuccessCallback, eventsErrorCallback);
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

  $scope.onMarkerClick = function(marker, eventName, model) {
    model.show = !model.show;
  };

  $scope.isStarted = function(event) {
    return moment().isAfter(event.start_date);
  };
});

appPageHome.controller('EventsInfoCtrl', function($scope, $log, $timeout){

  $scope.currentEvents = [];

  $scope.$watch('events', function () {
    var now = new Date();
    angular.forEach($scope.events, function(event) {
      if (new Date(event.end_date) >= now) {
        $scope.currentEvents.push(event);
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
  $scope.displayAllEvents = false;

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

  var currentWindowOpen = null;
  $scope.onMarkerClick = function(marker, eventName, model) {
    if (currentWindowOpen) {
      currentWindowOpen.show = false;
    }
    model.show = !model.show;
    if (model.show) {
      currentWindowOpen = model;
    } else {
      currentWindowOpen = null;
    }
  };
});

appPageHome.controller('EventInfoWindowCtrl', function($scope, $log, $document, $timeout){

  $scope.gotToEvent = function() {

    // Ugly trick, sorry : get the scope of EventsInfoCtrl
    $scope.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.eventsQuery = $scope.model.title;

    $timeout(function() {
      var event = angular.element.find('#event-' + $scope.model.id);
      $document.scrollToElementAnimated(event);
    }, 500);
  };

});