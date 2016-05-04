'use strict';

var appPageDashboard = angular.module('lyonRewards.dashboard', [
  'ngRoute',
  'chart.js',
  'lyonRewards.config',
  'angularMoment'
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

appPageDashboard.run(function ($route, $rootScope, $log, $location) {

  // Auto reload page when user change in dashboard
  var regexp = new RegExp('^/dashboard.*$');
  if(regexp.test($location.path())) {
    $rootScope.$watch('user.info', function() {
      $route.reload();
    });
  }
});

/**************************************************************************
 ***                           Dashboard                                ***
 **************************************************************************/

appPageDashboard.controller('DashboardCtrl', function($scope, $http, $rootScope, API_URL, $log) {

  $scope.pointsEarnedChart = {
    labels: [],
    data: []
  };
  $scope.pointsEvolutionChart = {
    labels: [],
    data: []
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

    // Transport Chart - Points
    if (!_.isNull($rootScope.user.info.bike_points) && !_.isNull($rootScope.user.info.tram_points) && !_.isNull($rootScope.user.info.walk_points)
      && ($rootScope.user.info.bike_points > 0 || $rootScope.user.info.tram_points > 0 || $rootScope.user.info.walk_points > 0)) {
      var transportPointsRounded = {
        bike: _.round($rootScope.user.info.bike_points, 2),
        tram: _.round($rootScope.user.info.tram_points, 2),
        walk: _.round($rootScope.user.info.walk_points, 2)
      };

      $scope.transportPointsChart = {
        labels: ['Vélo: ' + transportPointsRounded.bike + ' pts', 'Tram: ' + transportPointsRounded.tram + ' pts', 'Pied: ' + transportPointsRounded.walk + ' pts'],
        data: [transportPointsRounded.bike, transportPointsRounded.tram, transportPointsRounded.walk]
      };
    }

    // Transport Chart - Distance
    if (!_.isNull($rootScope.user.info.bike_distance) && !_.isNull($rootScope.user.info.tram_distance) && !_.isNull($rootScope.user.info.walk_distance)
      && ($rootScope.user.info.bike_distance > 0 || $rootScope.user.info.tram_distance > 0 || $rootScope.user.info.walk_distance > 0)) {
      var transportDistanceRounded = {
        bike: _.round($rootScope.user.info.bike_distance, 2),
        tram: _.round($rootScope.user.info.tram_distance, 2),
        walk: _.round($rootScope.user.info.walk_distance, 2)
      };

      $scope.transportDistanceChart = {
        labels: ['Vélo: ' + transportDistanceRounded.bike + ' km', 'Tram: ' + transportDistanceRounded.tram + ' km', 'Pied: ' + transportDistanceRounded.walk + ' km'],
        data: [transportDistanceRounded.bike, transportDistanceRounded.tram, transportDistanceRounded.walk]
      };
    }

    // Line Chart - Earned / Current Points
    if (!_.isNull($rootScope.user.info.id)) {
      var historySuccessCallback = function(response) {

        $log.debug(response);

        var labels = [],
          dataCurrentPoints = [],
          currentPoints = 0,
          dataEarnedPoints = [],
          currentPointsEarned = 0,
          currentDay = moment(_.head(response.data).date),
          addedLastEarnedPoints = false,
          addedLastCurrentPoints = false;

        angular.forEach(response.data, function(value) {

          if (value.hasOwnProperty('citizen_act')) {
            currentPoints += value.citizen_act.points;
            currentPointsEarned += value.citizen_act.points;
            addedLastEarnedPoints = false;
            addedLastCurrentPoints = false;
          } else if (value.hasOwnProperty('partner_offer')) {
            currentPoints -= value.partner_offer.points;
            addedLastCurrentPoints = false;
          } else {
            $log.error('Unknown item in history chart generation');
          }

          if (!currentDay.isSame(value.date, 'day')) {
            dataCurrentPoints.push(currentPoints);
            dataEarnedPoints.push(currentPointsEarned);
            labels.push(currentDay.format('DD MMMM YYYY'));
            currentDay = currentDay.add(1, 'd');
            addedLastEarnedPoints = true;
            addedLastCurrentPoints = true;
          }
        });

        if (!addedLastEarnedPoints || !addedLastCurrentPoints) {
          labels.push(currentDay.format('DD MMMM YYYY'));
          if (!addedLastEarnedPoints) {
            dataEarnedPoints.push(currentPointsEarned);
          }
          if (!addedLastCurrentPoints) {
            dataCurrentPoints.push(currentPoints);
          }
        }

        $scope.pointsEarnedChart.labels = labels;
        $scope.pointsEarnedChart.data.push(dataEarnedPoints);

        $scope.pointsEvolutionChart.labels = labels;
        $scope.pointsEvolutionChart.data.push(dataCurrentPoints);
      };
      var historyErrorCallback = function(response) {
        $log.error(response);
      };
      $http.get(API_URL + '/api/users/' + $rootScope.user.info.id + '/history/', {responseType: 'json'}).then(historySuccessCallback, historyErrorCallback);
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

});

appPageDashboard.controller('SupervisorTransportChartCtrl', function($scope, $http, API_URL, $log) {
  $scope.tranportChart = {
    labels: [],
    data: []
  };

  /*
  var usersSuccessCallback = function(response) {
    $log.debug(response);
    var labels = [],
      dataUsedPoints = [],
      dataEarnedPoints = [],
      lastUsedPoints = 0,
      lastEarnedPoints = 0;

    angular.forEach(response.data, function(value) {

      labels.push(moment(value.date).format('DD/MM à HH[h]mm'));

      if (value.hasOwnProperty('citizen_act')) {
        dataEarnedPoints.push(value.citizen_act.points);
        lastEarnedPoints = value.citizen_act.points;
        //dataUsedPoints.push(lastUsedPoints);
        dataUsedPoints.push(null);
      } else if (value.hasOwnProperty('partner_offer')) {
        dataUsedPoints.push(value.partner_offer.points);
        lastUsedPoints = value.partner_offer.points;
        //dataEarnedPoints.push(lastEarnedPoints);
        dataEarnedPoints.push(null);
      }
    });

    $scope.pointsChart.labels = labels;
    $scope.pointsChart.data = [
      dataUsedPoints,
      dataEarnedPoints
    ];

  };
  var usersErrorCallback = function(response) {
    $log.error(response);
  };
  $http.get(API_URL + '/api/users/', {responseType: 'json'}).then(usersSuccessCallback, usersErrorCallback);
  */
});

appPageDashboard.controller('SupervisorPointsChartCtrl', function($scope, $http, API_URL, $log) {

  $scope.pointsChart = {
    labels: [],
    data: [],
    series: []
  };

  // Line Chart - Points used / earned
  var historySuccessCallback = function(response) {
    $log.debug(response);

    if (response.data.length) {
      var labels = [],
        dataUsedPoints = [],
        dataEarnedPoints = [],
        currentPointsUsed = 0,
        currentPointsEarned = 0,
        currentDay = moment(_.head(response.data).date);

      angular.forEach(response.data, function(value) {

        if (value.hasOwnProperty('citizen_act')) {
          currentPointsEarned += value.citizen_act.points;
        } else if (value.hasOwnProperty('partner_offer')) {
          currentPointsUsed += value.partner_offer.points;
        }

        if (!currentDay.isSame(value.date, 'day')) {
          dataUsedPoints.push(currentPointsUsed);
          dataEarnedPoints.push(currentPointsEarned);
          labels.push(currentDay.format('DD MMMM YYYY'));
          currentDay = currentDay.add(1, 'd');
          currentPointsEarned = 0;
          currentPointsUsed = 0;
        }

      });

      if (currentPointsUsed != 0 || currentPointsEarned != 0) {
        labels.push(currentDay.format('DD MMMM YYYY'));
        if (currentPointsUsed != 0 && currentPointsEarned != 0) {
          dataEarnedPoints.push(currentPointsEarned);
          dataUsedPoints.push(currentPointsUsed);
        } else if (currentPointsEarned != 0) {
          dataEarnedPoints.push(currentPointsEarned);
          dataUsedPoints.push(null);
        } else if (currentPointsUsed != 0) {
          dataEarnedPoints.push(null);
          dataUsedPoints.push(currentPointsUsed);
        }
      }

      $scope.pointsChart.labels = labels;
      $scope.pointsChart.data = [
        dataUsedPoints,
        dataEarnedPoints
      ];
      $scope.pointsChart.series = ['Points utilisés', 'Points gagnés'];
    }
  };
  var historyErrorCallback = function(response) {
    $log.error(response);
  };
  $http.get(API_URL + '/api/users/globalhistory/', {responseType: 'json'}).then(historySuccessCallback, historyErrorCallback);

});

