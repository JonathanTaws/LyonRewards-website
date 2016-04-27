'use strict';

var appLogin = angular.module('lyonRewards.signup', []);

appLogin.run(function ($rootScope, $uibModal, $log) {

  $rootScope.signup = function () {

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'components/authentication/signup-modal.html',
      controller: 'SignupModalInstanceCtrl'
    });

    modalInstance.result.then(function () {

    }, function () {
      $log.info('Signup modal dismissed at: ' + new Date());
    });
  };
});

appLogin.controller('SignupModalInstanceCtrl', function ($scope, $uibModalInstance) {

  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});