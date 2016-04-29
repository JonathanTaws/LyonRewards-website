'use strict';

var appPagePartners = angular.module('lyonRewards.partners', ['ngRoute']);

appPagePartners.config(function($routeProvider) {
  $routeProvider.when('/partners', {
    templateUrl: 'view/page/partners/partners.html',
    controller: 'PartnersCtrl'
  });
});

appPagePartners.controller('PartnersCtrl', function($scope, $http) {

  $scope.offers = [];
  var loaderElt = jQuery('.partners .loader-container');
  var offersElt = jQuery('.partners .offers');
  offersElt.fadeOut(0);

  var displayPartners = function() {
    loaderElt.hide();
    offersElt.fadeIn(500);
  };

  var successCallback = function(response) {
    $scope.offers = response.data;
    displayPartners();
  };

  var errorCallback = function(response) {
    displayPartners();
  };

  $http.get('https://lyonrewards.antoine-chabert.fr/api/offers', {responseType: 'json'}).then(successCallback, errorCallback);
});