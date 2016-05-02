'use strict';

var appPageDashboard = angular.module('lyonRewards.dashboard', [
  'ngRoute',
  'chart.js',
  'lyonRewards.config'
]);

var checkUserLogin = function ($q, $rootScope, $location) {
  // TODO remove after dev
  //return true;
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


/**************************************************************************
 ***                           Dashboard                                ***
 **************************************************************************/

appPageDashboard.controller('DashboardCtrl', function($scope, $http) {

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

/**************************************************************************
 ***                            History                                 ***
 **************************************************************************/

appPageDashboard.controller('DashboardHistoryCtrl', function($scope, $http) {

});


/**************************************************************************
 ***                            Profile                                 ***
 **************************************************************************/

appPageDashboard.controller('DashboardProfileCtrl', function($scope, $http, $rootScope, $log, API_URL) {

  $scope.isEdit = false;

  $scope.editProfileForm = {
    email: null,
    firstName: null,
    lastName: null,
    password: null,
    passwordConfirmation: null
  };

  var resetMessages = function() {
    $scope.message = {
      success: null,
      info: null,
      error: null
    };
  };
  resetMessages();

  $scope.processEditProfileForm = function() {

    var valuesToPatch = _($scope.editProfileForm).omitBy(_.isUndefined).omitBy(_.isNull).omitBy(_.isEmpty).value();

    var editProfileSuccessCallback = function (response) {

      $log.debug(response);

      resetMessages();
      $scope.message.success = 'Modifications envoyées avec succès !';
      $scope.isEdit = false;
      $rootScope.user.info = response.data;
    };

    var editProfileErrorCallback = function (response) {
      $log.error(response);
      resetMessages();
      $scope.message.error = 'Problème lors de l\'envoie, veuillez réessayer plus tard.';
    };

    if (!_.isEmpty(valuesToPatch) && !_.isEmpty($rootScope.user.token) && !_.isNull($rootScope.user.info)) {
      if (valuesToPatch.hasOwnProperty('password') && valuesToPatch.hasOwnProperty('passwordConfirmation') && valuesToPatch.password !== valuesToPatch.passwordConfirmation) {
        resetMessages();
        $scope.message.error = 'Les deux mots de passe ne correspondent pas.';
      } else {
        if (valuesToPatch.hasOwnProperty('passwordConfirmation')) {
          delete valuesToPatch.passwordConfirmation;
        }
        $http({
          method  : 'patch',
          url     : API_URL + '/api/users/' + $rootScope.user.info.id + '/',
          data    : valuesToPatch,
          headers : { 'Content-Type': 'application/json', 'Authorization': 'Token ' + $rootScope.user.token }
        }).then(editProfileSuccessCallback, editProfileErrorCallback);
      }
    } else {
      resetMessages();
      $scope.message.info = 'Aucun champ modifié.';
    }
  };
});


/**************************************************************************
 ***                            Settings                                 ***
 **************************************************************************/

appPageDashboard.controller('DashboardSettingsCtrl', function($scope, $http) {

});

