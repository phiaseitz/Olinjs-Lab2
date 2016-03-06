// public/js/controllers/LoginController.js
// SignupController for rendering 'partials/login.html' page.
// including functions for users to log in for later visiting

app.controller('LoginController', function($scope, $location) {

$scope.login = function() {
  window.location.href = '/auth/spotify';
};

});