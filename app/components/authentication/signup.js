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

appLogin.controller('SignupModalInstanceCtrl', function ($scope, $uibModalInstance, $log, $http, API_URL) {

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

  var loaderElt = jQuery('#signup-modal > .loader');
  var contentElt = jQuery('#signup-modal > .content');
  var displayContent = function() {
    loaderElt.fadeOut(500);
    contentElt.fadeIn(500);
  };
  var displayLoader= function() {
    loaderElt.fadeIn(500);
    contentElt.fadeOut(500);
  };

  $scope.processSignupForm = function() {

    $log.debug($scope.signupForm);

    displayLoader();

    var valuesToPatch = _($scope.signupForm).omitBy(_.isUndefined).omitBy(_.isNull).omitBy(_.isEmpty).value();

    $log.debug(valuesToPatch);

    var signupSuccessCallback = function (response) {
      $log.debug(response);
      resetMessages();
      resetSignupForm();
      $uibModalInstance.close();
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
    resetSignupForm();
    displayContent();
    $uibModalInstance.close();
  };
});