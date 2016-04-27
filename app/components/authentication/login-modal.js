'use strict';

var appLogin = angular.module('lyonRewards.login', []);

appLogin.run(function ($rootScope, $uibModal, $log) {

  $rootScope.login = function () {

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'components/authentication/login-modal.html',
      controller: 'LoginModalInstanceCtrl'
    });

    modalInstance.result.then(function () {

    }, function () {
      $log.info('Login modal dismissed at: ' + new Date());
    });
  };
});

appLogin.controller('LoginModalInstanceCtrl', function ($scope, $uibModalInstance) {

  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});