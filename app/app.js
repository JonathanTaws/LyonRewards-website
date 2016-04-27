'use strict';

// Declare app level module which depends on views, and components
angular.module('lyonRewards', [
  'ngRoute',
  'ngAnimate',
  'angular-loading-bar',
  'lyonRewards.home',
  'lyonRewards.concept',
  'lyonRewards.ranking'
]).config(['$routeProvider', 'cfpLoadingBarProvider', function ($routeProvider, cfpLoadingBarProvider) {
  cfpLoadingBarProvider.latencyThreshold = 0;
  $routeProvider
      .when('/', {redirectTo: '/home'})
      .otherwise({redirectTo: '/home'}); // TODO Change to 404
}]).directive('activeLink', ['$location', function (location) {
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

jQuery(document).ready(function () {

  // fix menu when passed
  $('.masthead').visibility({
    once: false,
    onBottomPassed: function () {
      $('.fixed.menu').transition('fade in');
    },
    onBottomPassedReverse: function () {
      $('.fixed.menu').transition('fade out');
    }
  });

  // create sidebar and attach to menu open
  $('.ui.sidebar').sidebar('attach events', '.toc.item');

});
