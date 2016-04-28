'use strict';

angular.module('lyonRewards.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'view/page/home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', function($scope, $http) {

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