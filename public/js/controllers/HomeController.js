// public/js/controllers/HomeController.js

app.controller('HomeController', function($scope, authentication, Spotify) {
	console.log(authentication)

	Spotify.setAuthToken(authentication.user.accessToken)
	Spotify.getUserPlaylists(authentication.user.id).then(function (data){
		console.log(data);
	});
});