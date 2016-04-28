'use strict';

var appPageConcept = angular.module('lyonRewards.concept', ['ngRoute']);

appPageConcept.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/concept', {
    templateUrl: 'view/page/concept/concept.html',
    controller: 'ConceptCtrl'
  });
}]);

appPageConcept.controller('ConceptCtrl', [function() {

}]);