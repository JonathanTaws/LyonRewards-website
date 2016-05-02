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


/**************************************************************************
 ***                           Dashboard                                ***
 **************************************************************************/

appPageDashboard.controller('DashboardCtrl', function($scope, $http) {

  $scope.pointsEarnedChart = {
    labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet"],
    data: [
      [65, 59, 80, 81, 56, 55, 40]
    ]
  };

  $scope.transportChart = {
    labels: ["Voiture", "Bus", "Vélo", "Pied"],
    data: [300, 500, 100, 600]
  };

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

  $http.get(API_URL + '/api/users/' + $rootScope.user.info.id + '/history/', {responseType: 'json'}).then(historySuccessCallback, historyErrorCallback);

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

