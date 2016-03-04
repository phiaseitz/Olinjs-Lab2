// Create the controller. This is what controls the app. 
var wiki = angular.module('mashup', ['ngMaterial', 'spotify'])
.controller('AppCtrl', function ($scope, $log,  $http) {
    
})
// Se themes
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('pink')
    .warnPalette('red');
})
