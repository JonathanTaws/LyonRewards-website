'use strict';

var appLogin = angular.module('lyonRewards.login', ['http-auth-interceptor']);

appLogin.run(function ($rootScope, $uibModal, $log, $location, authService, $http) {

  $rootScope.user = {
    isLogin: false,
    token: '',
    info: null
  };
  $rootScope.$on('event:auth-loginRequired', function(event, data) {
    $rootScope.login();
  });
  $rootScope.$on('event:auth-loginConfirmed', function(event, data) {
    $rootScope.user.isLogin = true;
    $rootScope.user.token = data.token;
    $rootScope.user.info = data.user;
  });
  $rootScope.$on('event:auth-loginCancelled', function(event, data){
    $rootScope.user.isLogin = false;
    $rootScope.user.token = '';
    $rootScope.user.info = null;
    $log.info('User logout');
  });

  $rootScope.logout = function() {
    $location.path('/');
    authService.loginCancelled();
  };

  $rootScope.login = function () {

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'components/authentication/login-modal.html',
      controller: 'LoginModalInstanceCtrl'
    });

    modalInstance.result.then(function () {
      // Success
    }, function () {
      $log.debug('Login modal dismissed at: ' + new Date());
    });
  };
});

appLogin.controller('LoginModalInstanceCtrl', function ($scope, $uibModalInstance, $http, authService, $log) {

  // TODO remove later
  /*
  $scope.userForm = {
    username: 'antoine',
    password: 'azertyuiop'
  };*/

  $scope.ok = function () {
    var loader = jQuery('#login-modal > .loader');
    var content = jQuery('#login-modal > .content');
    var errorMsg = jQuery('#login-modal > .content > .error');

    loader.show();
    errorMsg.fadeOut(100);
    content.fadeOut(100);

    var successCallback = function(response) {
      if (typeof response != 'undefined') {
        $log.debug(response);
        if (typeof response.data != 'undefined'
          && typeof response.data.token != 'undefined'
          && typeof response.data.user != 'undefined') {

          authService.loginConfirmed({
            user: response.data.user,
            token: response.data.token
          });
          $uibModalInstance.close();
          return;
        }
      }
      loader.fadeOut(100);
      errorMsg.fadeIn(500);
      content.fadeIn(500);
    };

    var errorCallback = function (response) {
      if (typeof response != 'undefined') {
        $log.debug(response);
      }
      loader.fadeOut(100);
      errorMsg.fadeIn(500);
      content.fadeIn(500);
    };

    if (typeof $scope.userForm != 'undefined'
          && typeof $scope.userForm.username != 'undefined'
          && $scope.userForm.username !== ""
          && typeof $scope.userForm.password != 'undefined'
          && $scope.userForm.password !== "") {

      $http({
          method: 'post',
          url: 'https://lyonrewards.antoine-chabert.fr/api/login/',
          data: jQuery.param({
            username: $scope.userForm.username,
            password: $scope.userForm.password
          }),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }
      ).then(successCallback, errorCallback);

    } else {
      errorCallback();
    }
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

});