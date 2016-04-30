'use strict';

var appPageOffers = angular.module('lyonRewards.offers', ['ngRoute', 'ngAnimate']);

appPageOffers.config(function($routeProvider) {
  $routeProvider.when('/offers', {
    templateUrl: 'view/page/offers/offers.html',
    controller: 'OffersCtrl'
  });
});

appPageOffers.controller('OffersCtrl', function($scope, $http, $q) {

  $scope.offers = [];
  var loaderOffersElt = jQuery('.offers-page .loader-offers');
  var offersElt = jQuery('.offers-page .offers');
  var filtersElt = jQuery('.offers-page .filters');
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