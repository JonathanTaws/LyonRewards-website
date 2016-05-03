'use strict';

var appPageDashboard = angular.module('lyonRewards.dashboard', [
  'ngRoute',
  'chart.js',
  'lyonRewards.config'
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

appPageDashboard.config(['$routeProvider', function($routeProvider, $rootScope) {
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
  }).when('/dashboard/supervisor', {
    templateUrl: 'view/page/dashboard/page/supervisor.html',
    controller: 'DashboardSupervisorCtrl',
    resolve: {
      factory: function($q, $rootScope, $location) {
        return checkUserLogin($q, $rootScope, $location) && ($rootScope.user.isSupervisor || $rootScope.user.isAdmin);
      }
    }
  }).otherwise({ redirectTo: '/' });

}]);

appPageDashboard.run(function ($route, $rootScope) {

  // Auto reload page when user change
  $rootScope.$watch('user.info', function() {
    $route.reload();
  });
});




/**************************************************************************
 ***                           Dashboard                                ***
 **************************************************************************/

appPageDashboard.controller('DashboardCtrl', function($scope, $http, $rootScope) {

  $scope.pointsEarnedChart = {
    labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet"],
    data: [
      [65, 59, 80, 81, 56, 55, 40]
    ]
  };

  $scope.transportPointsChart = {
    labels: [],
    data: []
  };
  $scope.transportDistanceChart = {
    labels: [],
    data: []
  };

  if ($rootScope.user.isLogin && !_.isNull($rootScope.user.info)) {

    if (!_.isNull($rootScope.user.info.bike_points) && !_.isNull($rootScope.user.info.tram_points) && !_.isNull($rootScope.user.info.walk_points)
      && ($rootScope.user.info.bike_points > 0 || $rootScope.user.info.tram_points > 0 || $rootScope.user.info.walk_points > 0)) {
      var transportPointsRounded = {
        bike: _.round($rootScope.user.info.bike_points, 2),
        tram: _.round($rootScope.user.info.tram_points, 2),
        walk: _.round($rootScope.user.info.walk_points, 2)
      };

      $scope.transportPointsChart = {
        labels: ['Vélo: ' + transportPointsRounded.bike + ' pts', 'Bus: ' + transportPointsRounded.tram + ' pts', 'Pied: ' + transportPointsRounded.walk + ' pts'],
        data: [transportPointsRounded.bike, transportPointsRounded.tram, transportPointsRounded.walk]
      };
    }

    if (!_.isNull($rootScope.user.info.bike_distance) && !_.isNull($rootScope.user.info.tram_distance) && !_.isNull($rootScope.user.info.walk_distance)
      && ($rootScope.user.info.bike_distance > 0 || $rootScope.user.info.tram_distance > 0 || $rootScope.user.info.walk_distance > 0)) {
      var transportDistanceRounded = {
        bike: _.round($rootScope.user.info.bike_distance, 2),
        tram: _.round($rootScope.user.info.tram_distance, 2),
        walk: _.round($rootScope.user.info.walk_distance, 2)
      };

      $scope.transportDistanceChart = {
        labels: ['Vélo: ' + transportDistanceRounded.bike + ' km', 'Bus: ' + transportDistanceRounded.tram + ' km', 'Pied: ' + transportDistanceRounded.walk + ' km'],
        data: [transportDistanceRounded.bike, transportDistanceRounded.tram, transportDistanceRounded.walk]
      };
    }
  }

});

/**************************************************************************
 ***                            History                                 ***
 **************************************************************************/

appPageDashboard.controller('DashboardHistoryCtrl', function($scope, $http, API_URL, $log, $rootScope) {

  $scope.historyList = [];
  $scope.historyOrderBy = '-date';

  var loaderHistoryElt = jQuery('.history-page .loader-history');
  var historyTableElt = jQuery('.history-page .history-table');
  var filtersElt = jQuery('.history-page .filters');
  filtersElt.fadeOut(0);
  historyTableElt.fadeOut(0);

  var displayHistory = function() {
    loaderHistoryElt.hide();
    historyTableElt.fadeIn(500);
    filtersElt.fadeIn(500);
  };

  var historySuccessCallback = function(response) {
    $scope.historyList = response.data;
    $log.debug(response);
    displayHistory();
  };

  var historyErrorCallback = function(response) {
    $log.error(response);
    displayHistory();
  };

  if ($rootScope.user.isLogin && !_.isNull($rootScope.user.info.id)) {
    $http.get(API_URL + '/api/users/' + $rootScope.user.info.id + '/history/', {responseType: 'json'}).then(historySuccessCallback, historyErrorCallback);
  } else {
    displayHistory();
  }

});


/**************************************************************************
 ***                            Profile                                 ***
 **************************************************************************/

appPageDashboard.controller('DashboardProfileCtrl', function($scope, $http, $rootScope, $log, API_URL) {

  $scope.isEdit = false;

  $scope.resetEditProfileForm = function () {
    $scope.editProfileForm = {
      email: null,
      firstName: null,
      lastName: null,
      password: null,
      passwordConfirmation: null
    };
  };
  $scope.resetEditProfileForm();

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
      $scope.resetEditProfileForm();
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

/**************************************************************************
 ***                          Supervisor                                ***
 **************************************************************************/

appPageDashboard.controller('DashboardSupervisorCtrl', function($scope, $http, API_URL, $log) {

  $scope.users = [];

  $scope.pointsEarnedChart = {
    labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet"],
    data: [
      [65, 59, 80, 81, 56, 55, 40]
    ]
  };
  
  var usersSuccessCallback = function(response) {
    $scope.users = response.data;
    $log.debug(response);
  };

  var usersErrorCallback = function(response) {
    $log.error(response);
  };

  $http.get(API_URL + '/api/users', {responseType: 'json'}).then(usersSuccessCallback, usersErrorCallback);
});

