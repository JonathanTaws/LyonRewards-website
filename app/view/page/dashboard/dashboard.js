'use strict';

var appPageDashboard = angular.module('lyonRewards.dashboard', [
  'ngRoute',
  'chart.js'
]);

var checkUserLogin = function ($q, $rootScope, $location) {
  // TODO remove after dev
  return true;
  if ($rootScope.user.isLogin) {
    return true;
  } else {
    $location.path('/login');
  }
};

appPageDashboard.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl: 'view/page/dashboard/page/dashboard.html',
    controller: 'DashboardCtrl',
    resolve: {
      factory: checkUserLogin
    }
  }).when('/dashboard/history', {
    templateUrl: 'view/page/dashboard/page/history.html',
    controller: 'DashboardHistoryCtrl',
    resolve: {
      factory: checkUserLogin
    }
  }).when('/dashboard/profile', {
    templateUrl: 'view/page/dashboard/page/profile.html',
    controller: 'DashboardProfileCtrl',
    resolve: {
      factory: checkUserLogin
    }
  }).when('/dashboard/settings', {
    templateUrl: 'view/page/dashboard/page/settings.html',
    controller: 'DashboardSettingsCtrl',
    resolve: {
      factory: checkUserLogin
    }
  }).otherwise({ redirectTo: '/' });

}]);

appPageDashboard.controller('DashboardCtrl', function($scope, $http) {

});

appPageDashboard.controller('DashboardHistoryCtrl', function($scope, $http) {

});

appPageDashboard.controller('DashboardProfileCtrl', function($scope, $http) {

});

appPageDashboard.controller('DashboardSettingsCtrl', function($scope, $http) {

});

appPageDashboard.controller("PointsEarnedChartCtrl", function ($scope) {

  $scope.labels = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet"];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40]
  ];
});

appPageDashboard.controller("TransportChartCtrl", function ($scope) {

  $scope.labels = ["Voiture", "Bus", "Vélo", "Pied"];
  $scope.data = [300, 500, 100, 600];
});