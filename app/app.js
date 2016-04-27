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

app.directive('initApp', function() {
  return {
    restrict: 'C',
    link: function(scope, elem, attrs) {

      // Fix menu when passed
      elem.find('.masthead').visibility({
        once: false,
        onBottomPassed: function () {
          $('.fixed.menu').transition('fade in');
        },
        onBottomPassedReverse: function () {
          $('.fixed.menu').transition('fade out');
        }
      });

      // Create sidebar and attach to menu open
      elem.find('.ui.sidebar').sidebar('attach events', '.toc.item');

      // Login modal
      var login = elem.find('#auth-modal.ui.modal');
      scope.$on('event:auth-loginRequired', function() {
        login.modal('show');
      });
      scope.$on('event:auth-loginConfirmed', function() {
        login.modal('hide');
      });
    }
  }
});

app.directive('includeReplace', function () {
  return {
    require: 'ngInclude',
    restrict: 'A', /* optional */
    link: function (scope, el, attrs) {
      el.replaceWith(el.children());
    }
  };
});

/*****************************************************************
 *                     Functions Document Ready                  *
 *****************************************************************/

jQuery(document).ready(function () {

});
