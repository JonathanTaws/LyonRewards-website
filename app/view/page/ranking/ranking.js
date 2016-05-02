'use strict';

var appPageRanking = angular.module('lyonRewards.ranking', ['ngRoute']);

appPageRanking.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/ranking', {
    templateUrl: 'view/page/ranking/ranking.html',
    controller: 'RankingCtrl'
  });
}]);

appPageRanking.controller('RankingCtrl', function($scope, $http, $log) {

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
});