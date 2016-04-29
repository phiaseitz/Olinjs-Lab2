// Create the controller. This is what controls the app. 
var app = angular.module('gitify', [
    'ngRoute',
    'spotify',
    'ngMaterial'
  ])

.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {

  $routeProvider
    .when('/', {
      templateUrl: 'partials/home.html',
      controller: 'HomeController',
      resolve: {
        authentication: function(AuthService, $route) {
          return AuthService.ensureAuthenticated();
        },
      }
    })
    .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'LoginController'
    });
    //otherwise statement would be good here to handle 404s
  $locationProvider.html5Mode(true);
}]);
