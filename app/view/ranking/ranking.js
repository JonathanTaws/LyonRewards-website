'use strict';

angular.module('lyonRewards.ranking', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/ranking', {
    templateUrl: 'view/ranking/ranking.html',
    controller: 'RankingCtrl'
  });
}])

.controller('RankingCtrl', [function() {

}]);