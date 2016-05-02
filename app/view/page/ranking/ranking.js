'use strict';

var appPageRanking = angular.module('lyonRewards.ranking', [
  'ngRoute',
  'ngTable',
  'lyonRewards.config'
]);

appPageRanking.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/ranking', {
    templateUrl: 'view/page/ranking/ranking.html',
    controller: 'RankingCtrl'
  });
}]);

appPageRanking.controller('RankingCtrl', function($scope, $http, $log, NgTableParams, API_URL) {

  $scope.usersRanking = [];
  var loaderRankingElt = jQuery('.ranking-page .loader-ranking');
  var rankingElt = jQuery('.ranking-page .ranking');
  var filtersElt = jQuery('.ranking-page .filters');
  rankingElt.fadeOut(0);
  filtersElt.fadeOut(0);
  var displayRanking = function() {
    loaderRankingElt.hide();
    rankingElt.fadeIn(500);
    filtersElt.fadeIn(500);
  };
  var successRanking = function(response) {
    $log.debug(response);
    $scope.usersRanking = response.data;
    displayRanking();
  };
  var errorRanking = function(response) {
    $log.debug(response);
    displayRanking();
  };

  $scope.tableParams = new NgTableParams({}, {
    getData: function(params) {
      return $http.get(API_URL + '/api/users/ranking', {responseType: 'json'}).then(function (response) {
        successRanking(response);
        return $scope.usersRanking;
      }, errorRanking);
    }
  });
});