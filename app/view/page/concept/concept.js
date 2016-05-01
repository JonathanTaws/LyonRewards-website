'use strict';

var appPageConcept = angular.module('lyonRewards.concept', ['ngRoute']);

appPageConcept.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/concept', {
    templateUrl: 'view/page/concept/concept.html',
    controller: 'ConceptCtrl'
  });
}]);

appPageConcept.controller('ConceptCtrl', function($scope, $http) {

  $scope.partners = [];
  var loaderPartnersElt = jQuery('.concept-page .loader-partners');
  var partnersElt = jQuery('.concept-page .partners');
  partnersElt.fadeOut(0);
  var displayPartners = function() {
    loaderPartnersElt.hide();
    partnersElt.fadeIn(500);
  };
  var successPartners = function(response) {
    $scope.partners = response.data;
    displayPartners();
  };
  var errorPartners = function(response) {
    displayPartners();
  };
  $http.get('https://lyonrewards.antoine-chabert.fr/api/partners', {responseType: 'json'}).then(successPartners,errorPartners);

});