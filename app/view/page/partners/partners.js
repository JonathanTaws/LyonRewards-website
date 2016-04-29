'use strict';

var appPagePartners = angular.module('lyonRewards.partners', ['ngRoute']);

appPagePartners.config(function($routeProvider) {
  $routeProvider.when('/partners', {
    templateUrl: 'view/page/partners/partners.html',
    controller: 'PartnersCtrl'
  });
});

appPagePartners.controller('PartnersCtrl', function($scope, $http, $q) {

  // Offers Section
  $scope.offers = [];
  var loaderOffersElt = jQuery('.partners-page .loader-offers');
  var offersElt = jQuery('.partners-page .offers');
  offersElt.fadeOut(0);
  var displayOffers = function() {
    loaderOffersElt.hide();
    offersElt.fadeIn(500);
  };
  var successOffers = function(response) {
    $scope.offers = response.data;
    displayOffers();
  };
  var errorOffers = function(response) {
    displayOffers();
  };
  $http.get('https://lyonrewards.antoine-chabert.fr/api/offers', {responseType: 'json'}).then(successOffers,errorOffers);


  // Partners Section
  $scope.partners = [];
  var loaderPartnersElt = jQuery('.partners-page .loader-partners');
  var partnersElt = jQuery('.partners-page .partners');
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
  $http.get('https://lyonrewards.antoine-chabert.fr/api/partners', {responseType: 'json'}).then(successPartners, errorPartners);

});