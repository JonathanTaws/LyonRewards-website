'use strict';

var appLogin = angular.module('lyonRewards.login', ['http-auth-interceptor']);

appLogin.run(function ($rootScope, $uibModal, $log) {

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
    // TODO
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
      authService.loginConfirmed();
      $uibModalInstance.close();
    };

    var errorCallback = function (response) {
      $log.debug(response);
      loader.hide();
      errorMsg.show();
      content.show();
    };

    // TODO remove, just a test
    $http.get('https://lyonrewards.antoine-chabert.fr/api/events/1', {responseType: 'json'}).then(successCallback, errorCallback);

    /* When API Auth is done
    $http.post('https://lyonrewards.antoine-chabert.fr/auth', $scope.user, {responseType: 'json'}).then(successCallback, errorCallback);
    */
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});