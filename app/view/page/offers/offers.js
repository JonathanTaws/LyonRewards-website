'use strict';

var appPageOffers = angular.module('lyonRewards.offers', ['ngRoute', 'ngAnimate', 'monospaced.qrcode']);

appPageOffers.config(function($routeProvider) {
  $routeProvider.when('/offers', {
    templateUrl: 'view/page/offers/offers.html',
    controller: 'OffersCtrl'
  });
});

appPageOffers.controller('OffersCtrl', function($scope, $http, $rootScope, $log, $uibModal) {

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

  // Init filters
  $scope.selectedPartner = {
    partner: {
      id: '!!'
    }
  };

  $scope.offersOrderBy = '+points';

  // Use points
  $scope.usePoints = function (offer) {
    if ($rootScope.user.isLogin && !_.isNull($rootScope.user.info) && $rootScope.user.info.current_points >= offer.points) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'view/page/offers/embed/offer-modal.html',
        controller: 'OfferModalInstanceCtrl',
        resolve: {
          offer: function () {
            return offer;
          }
        }
      });
      modalInstance.result.then();
    } else if ($rootScope.user.isLogin) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'view/page/offers/embed/info-modal.html',
        controller: 'InfoModalInstanceCtrl'
      });
      modalInstance.result.then();
    } else {
      $rootScope.login();
    }
  };
});

appPageOffers.controller('OfferModalInstanceCtrl', function ($scope, $uibModalInstance, offer) {
  $scope.offer = offer;
  $scope.ok = function () {
      $uibModalInstance.close();
  };
});

appPageOffers.controller('InfoModalInstanceCtrl', function ($scope, $uibModalInstance) {
  $scope.ok = function () {
    $uibModalInstance.close();
  };
});