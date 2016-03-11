//This is a fairly simple controller for handling the login logic. We have a button that redirects to the /auth/spotify route. We realize that the
// ui of this portion of the app could be improved a little. 

// public/js/controllers/LoginController.js
// SignupController for rendering 'partials/login.html' page.
// including functions for users to log in for later visiting

app.controller('LoginController', function($scope, $location) {

$scope.login = function() {
  window.location.href = '/auth/spotify';
};

});