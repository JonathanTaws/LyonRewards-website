'use strict';

var appPagePartners = angular.module('lyonRewards.partners', ['ngRoute', 'ngAnimate']);

appPagePartners.config(function($routeProvider) {
  $routeProvider.when('/partners', {
    templateUrl: 'view/page/partners/partners.html',
    controller: 'PartnersCtrl'
  });
});

appPagePartners.controller('PartnersCtrl', function($scope, $http, $q) {

  $scope.offers = [];
  var loaderOffersElt = jQuery('.partners-page .loader-offers');
  var offersElt = jQuery('.partners-page .offers');
  var filtersElt = jQuery('.partners-page .filters');
  offersElt.fadeOut(0);
  filtersElt.fadeOut(0);
  var displayOffers = function() {
    loaderOffersElt.hide();
    offersElt.fadeIn(500);
    filtersElt.fadeIn(500);
  };
  var successOffers = function(response) {
    $scope.offers = response.data;
    displayOffers();
  };
  var errorOffers = function(response) {
    displayOffers();
  };
  $http.get('https://lyonrewards.antoine-chabert.fr/api/offers', {responseType: 'json'}).then(successOffers,errorOffers);

});