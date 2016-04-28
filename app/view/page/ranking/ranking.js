'use strict';

var appPageRanking = angular.module('lyonRewards.ranking', ['ngRoute']);

appPageRanking.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/ranking', {
    templateUrl: 'view/page/ranking/ranking.html',
    controller: 'RankingCtrl'
  });
}]);

appPageRanking.controller('RankingCtrl', [function() {

}]);