'use strict';

angular.module('lyonRewards.concept', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/concept', {
    templateUrl: 'view/concept/concept.html',
    controller: 'ConceptCtrl'
  });
}])

.controller('ConceptCtrl', [function() {

}]);