'use strict';

var appLogin = angular.module('lyonRewards.login', ['http-auth-interceptor']);

appLogin.run(function ($rootScope, $uibModal, $log, $location) {

  $rootScope.isLogin = false;
  $rootScope.$on('event:auth-loginRequired', function() {
    $rootScope.login();
  });
  $rootScope.$on('event:auth-loginConfirmed', function() {
    $rootScope.isLogin = true;
  });

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

  $rootScope.logout = function() {
    $location.path('/');
    $rootScope.isLogin = false;
  }
});

appLogin.controller('LoginModalInstanceCtrl', function ($scope, $uibModalInstance, $http, authService, $log) {

  $scope.ok = function () {
    var loader = jQuery('#login-modal > .loader');
    var content = jQuery('#login-modal > .content');
    var errorMsg = jQuery('#login-modal > .content > .error');

    loader.show();
    errorMsg.hide();
    content.hide();

    var successCallback = function(response) {
      $log.debug(response);
      authService.loginConfirmed(response.token);
      $uibModalInstance.close();
    };

    var errorCallback = function (response) {
      $log.debug(response);
      loader.hide();
      errorMsg.show();
      content.show();
    };

    $http({
        method: 'post',
        url: 'https://lyonrewards.antoine-chabert.fr/api/login/',
        data: jQuery.param({
          username: $scope.user.username,
          password: $scope.user.password
        }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }
    ).then(successCallback, errorCallback);

  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});