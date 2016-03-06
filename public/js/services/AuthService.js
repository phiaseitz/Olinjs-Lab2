// public/javascripts/services/AuthService.js

var routeForUnauthorizedAccess = '/login';

app.service('AuthService', function($http, $q, $rootScope, $location) {

  this.permissions = {
    authenticated: false,
    user: {}
  };

  this.getAuthenticated = function() {
    return $http.get('/api/getAuthenticated');
  };

  this.login = function(credentials) {
    var service = this;
    $http.post('/login', credentials).then(function success(response) {
      service.getAuthenticated().then(function success(response) {
        service.permissions = response.data;
      })
      $location.path('/');
    });
  };

  this.logout = function() {
    var service = this;
    $http.get('/logout').then(function success(response) {
      service.getAuthenticated().then(function success(response) {
        service.permissions = response.data;
      })
      $location.path(routeForUnauthorizedAccess);
    });
  };

  this.ensureAuthenticated = function() {
    var deferred = $q.defer();
    var service = this;
    service.getAuthenticated().then(function success(response) {
      service.permissions = response.data;
      if (!service.permissions.authenticated) {
        $location.path(routeForUnauthorizedAccess);
        $rootScope.$on('$locationChangeSuccess', function (next, current) {
            deferred.resolve();
        });
      }
      deferred.resolve();
    });
    return deferred.promise;
  };

});