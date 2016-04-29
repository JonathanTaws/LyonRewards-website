'use strict';

var appPageDashboard = angular.module('lyonRewards.dashboard', [
  'ngRoute',
  'chart.js'
]);

var checkUserLogin = function ($q, $rootScope, $location) {
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

appPageDashboard.controller('DashboardSettingsCtrl', function($scope, $http) {

});

appPageDashboard.controller("PointsEarnedCtrl", function ($scope) {

  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
});

