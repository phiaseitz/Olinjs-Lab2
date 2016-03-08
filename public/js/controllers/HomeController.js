// public/js/controllers/HomeController.js
app.controller('HomeController', function($scope, AuthService, Spotify) {
	$scope.currentPlaylist = {};

	//Get the playlists that the user is tracking!


	// Spotify Auth stuff. This is the authentication token we get when we 
	// authenticate with passport-spotify. 
	Spotify.setAuthToken(AuthService.permissions.user.accessToken);

	// Get the user's playlists. 
	Spotify.getUserPlaylists(AuthService.permissions.user.id).then(function (data){
		
		data.items.forEach(function (playlist){
			Spotify.getPlaylist(playlist.owner.id, playlist.id).then(function(data){
				playlist.tracks = data.tracks;
			});

			//if the playlist is a currently tracked playlist, add that to the playlist object
			playlist.isTracked = false;
		});

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
	//Get the users's tracked playlists

	//Populate those playlists

	//Post those playlist states back to the server

	
	//Show a users's playlists. 
	$scope.showPlaylist = function(playlist) {
		$scope.currentPlaylist = playlist
	}

	// When we actually get to reverting, we have the methods 
	// addPlaylistTracks
	// removePlaylistTracks
	// reorderPlaylistTracks
	// replacePlaylistTracks

	//If the playlist does not belong to the current user, we should create a new playlist for that user with the version they want? 
	// Do we copy over the history for that playlist? 
});