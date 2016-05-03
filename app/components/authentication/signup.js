'use strict';

var appLogin = angular.module('lyonRewards.signup', [
  'http-auth-interceptor',
  'lyonRewards.config'
]);

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

appLogin.controller('SignupModalInstanceCtrl', function ($scope, $uibModalInstance, $log, $http, API_URL, authService) {

  var resetSignupForm = function () {
    $scope.signupForm = {
      username: null,
      email: null,
      firstName: null,
      lastName: null,
      password: null,
      passwordConfirmation: null
    };
  };
  resetSignupForm();
  $scope.resetSignupForm = resetSignupForm;

  var resetMessages = function() {
    $scope.message = null;
  };
  resetMessages();

  var displayContent = function() {
    jQuery('#signup-modal > .loader').fadeOut(100);
    jQuery('#signup-modal > .content').fadeIn(100);
  };
  var displayLoader= function() {
    jQuery('#signup-modal > .loader').fadeIn(100);
    jQuery('#signup-modal > .content').fadeOut(100);
  };

  $scope.processSignupForm = function() {

    $log.debug($scope.signupForm);

    displayLoader();

    var valuesToPatch = _($scope.signupForm).omitBy(_.isUndefined).omitBy(_.isNull).omitBy(_.isEmpty).value();

    $log.debug(valuesToPatch);

    var signupSuccessCallback = function (responseSignup) {
      $log.debug(responseSignup);
      resetMessages();
      resetSignupForm();

      // TODO make a promise to signup then login ...
      $http({
          method: 'post',
          url: API_URL + '/api/login/',
          data: jQuery.param({
            username: valuesToPatch.username,
            password: valuesToPatch.password
          }),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }
      ).then(function(responseLogin) {
        $log.debug(responseLogin);

        // TODO refactoring needed with login.js
        if (typeof responseLogin != 'undefined') {

          if (typeof responseLogin.data != 'undefined'
            && typeof responseLogin.data.token != 'undefined'
            && typeof responseLogin.data.user != 'undefined') {

            authService.loginConfirmed({
              user: responseLogin.data.user,
              token: responseLogin.data.token
            });
          }
        }
        $uibModalInstance.close();
      }, function(responseLogin) {
        $log.error(responseLogin);
        $log.error('Impossible to login new user ! See log above.');
      });
    };

    var signupErrorCallback = function (response) {
      $log.error(response);
      resetMessages();
      $scope.message = 'Problème lors de l\'envoie, veuillez réessayer plus tard.';
      displayContent();
    };

    if (
      valuesToPatch.hasOwnProperty('password')
      && valuesToPatch.hasOwnProperty('passwordConfirmation')
      && valuesToPatch.hasOwnProperty('username')
      && valuesToPatch.hasOwnProperty('email')
      && valuesToPatch.hasOwnProperty('first_name')
      && valuesToPatch.hasOwnProperty('last_name')
    ) {
      if (valuesToPatch.password !== valuesToPatch.passwordConfirmation) {
        resetMessages();
        $scope.message = 'Les deux mots de passe ne correspondent pas.';
        displayContent();
      } else {
        if (valuesToPatch.hasOwnProperty('passwordConfirmation')) {
          delete valuesToPatch.passwordConfirmation;
        }
        $http({
          method  : 'post',
          url     : API_URL + '/api/users/',
          data    : valuesToPatch,
          headers : { 'Content-Type': 'application/json' }
        }).then(signupSuccessCallback, signupErrorCallback);
      }
    } else {
      resetMessages();
      $scope.message = 'Vous avez oublié un ou plusieurs champs, vérifiez votre saisie (tous les champs sont obligatoires).';
      displayContent();
    }
  };

  $scope.cancel = function() {
    $uibModalInstance.close();
  };
});