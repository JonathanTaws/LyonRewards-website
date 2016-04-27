'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('lyonRewards', [
  'ngRoute',
  'ngAnimate',
  'angular-loading-bar',
  'http-auth-interceptor',
  'lyonRewards.home',
  'lyonRewards.concept',
  'lyonRewards.ranking'
]);

// Configuration
app.config(['$routeProvider', 'cfpLoadingBarProvider', function ($routeProvider, cfpLoadingBarProvider) {
  cfpLoadingBarProvider.latencyThreshold = 0;
  $routeProvider
      .when('/', {redirectTo: '/home'})
      .otherwise({redirectTo: '/home'}); // TODO Change to 404
}]);

// Main controler
app.controller('MainCtrl', ['$scope', '$element', function(scope, element) {

}]);

/*****************************************************************
 *                             Directives                        *
 *****************************************************************/

/**
 * Menu usefull like : <a class="active item" href="#/home" active-link="active">Accueil</a>
 * Directive : active-link="<name of the classes to display if active>"
 */
app.directive('activeLink', ['$location', function (location) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs, controller) {
      var clazz = attrs.activeLink;
      var path = attrs.href;
      path = path.substring(1); //hack because path does not return including hashbang
      scope.location = location;
      scope.$watch('location.path()', function (newPath) {
        if (path === newPath) {
          element.addClass(clazz);
        } else {
          element.removeClass(clazz);
        }
      });
    }
  };
}]);

app.directive('includeReplace', function () {
  return {
    require: 'ngInclude',
    restrict: 'A', /* optional */
    link: function (scope, el, attrs) {
      el.replaceWith(el.children());
    }
  };
});
