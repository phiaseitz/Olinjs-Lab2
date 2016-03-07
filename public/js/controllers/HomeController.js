// public/js/controllers/HomeController.js

app.controller('HomeController', function($scope, authentication, Spotify) {
	console.log(authentication)

	$scope.currentPlaylist = {};

	// Spotify Auth stuff. This is the authentication token we get when we 
	// authenticate with passport-spotify. 
	Spotify.setAuthToken(authentication.user.accessToken)

	// Get the user's playlists. 
	Spotify.getUserPlaylists(authentication.user.id).then(function (data){
		$scope.userPlaylists = data.items;
	});

	$scope.showPlaylist = function(playlist) {
		Spotify.getPlaylist(playlist.owner.id, playlist.id).then(function(data){
			console.log(data);
			$scope.currentPlaylist = data;
		})
	}
});