'use strict';

var appPageDashboard = angular.module('lyonRewards.dashboard', ['ngRoute']);

appPageDashboard.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl: 'view/page/dashboard/dashboard.html',
    controller: 'DashboardCtrl' /*, TODO Uncomment in production
    resolve: {
      factory: function ($q, $rootScope, $location) {
        if ($rootScope.isLogin) {
          return true;
        } else {
          $location.path('/login');
        }
      }
    }*/
  }).otherwise({ redirectTo: '/' });

}]);

appPageDashboard.controller('DashboardCtrl', function($scope, $http) {

});
