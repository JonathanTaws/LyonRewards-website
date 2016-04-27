'use strict';

angular.module('lyonRewards.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'view/page/home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', [function() {

}]);