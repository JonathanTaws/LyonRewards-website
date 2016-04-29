'use strict';

var appPagePartners = angular.module('lyonRewards.partners', ['ngRoute']);

appPagePartners.config(function($routeProvider) {
  $routeProvider.when('/partners', {
    templateUrl: 'view/page/partners/partners.html',
    controller: 'PartnersCtrl'
  });
});

appPagePartners.controller('PartnersCtrl', function() {

});