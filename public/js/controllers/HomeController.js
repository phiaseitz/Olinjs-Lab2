// public/js/controllers/HomeController.js

app.controller('HomeController', function($scope, authentication, Spotify) {
	console.log(authentication)

	$scope.currentPlaylist = {};

	// Spotify Auth stuff. This is the authentication token we get when we 
	// authenticate with passport-spotify. 
	Spotify.setAuthToken(authentication.user.accessToken)

	// Get the user's playlists. 
	Spotify.getUserPlaylists(authentication.user.id).then(function (data){
		$scope.userPlaylists = data.items.sort(function (a,b){
			if(a.name > b.name) {
				return 1;
			} else if (a.name < b.name) {
				return -1;
			} else {
				return 0;
			}
		});
	});

	$scope.showPlaylist = function(playlist) {
		Spotify.getPlaylist(playlist.owner.id, playlist.id).then(function(data){
			console.log(data);
			$scope.currentPlaylist = data;
		})
	}

	// When we actually get to reverting, we have the methods 
	// addPlaylistTracks
	// removePlaylistTracks
	// reorderPlaylistTracks
	// replacePlaylistTracks

	//If the playlist does not belong to the current user, we should create a new playlist for that user with the version they want? 
	// Do we copy over the history for that playlist? 
});