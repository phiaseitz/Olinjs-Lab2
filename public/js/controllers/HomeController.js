// public/js/controllers/HomeController.js
app.controller('HomeController', function($scope, AuthService, PlaylistService, Spotify) {
	$scope.currentPlaylist = {};

	//Get the playlists that the user is tracking!
	PlaylistService.getPlaylists(AuthService.permissions.user.id).then(function(playlists){
		$scope.trackedPlaylists = playlists || [];

		console.log(playlists)

		// Spotify Auth stuff. This is the authentication token we get when we 
		// authenticate with passport-spotify. 
		Spotify.setAuthToken(AuthService.permissions.user.accessToken);

		// Get the user's playlists. 
		Spotify.getUserPlaylists(AuthService.permissions.user.id).then(function (data){
			
			data.items.forEach(function (playlist){
				Spotify.getPlaylist(playlist.owner.id, playlist.id).then(function(populatedPlaylist){
					playlist.tracks = populatedPlaylist.tracks;
					// console.log(populatedPlaylist.tracks)
				});

				//if the playlist is a currently tracked playlist, add that to the playlist object
				if ($scope.trackedPlaylists.indexOf(playlist.id) > 0){
					playlist.isTracked = true;

					PlaylistService.savePlaylist(playlist.id, getPlaylistSongs(playlist)).then(function(response){
						console.log("saved!");
					});
				} else {
					playlist.isTracked = false;
				}
				
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
	})

	$scope.trackPlaylist = function(playlist){
		PlaylistService.trackPlaylist(playlist.id, getPlaylistSongs(playlist)).then(function(response){
			console.log(response);
			if (response.success) {
				playlist.isTracked = true;
			}
		})
		
	}

	$scope.untrackPlaylist = function(playlist){
		PlaylistService.untrackPlaylist(playlist.id).then(function(response){
			console.log(response);
			if (response.success) {
				playlist.isTracked = false;
			}
		})
		
	}


	//Get the users's tracked playlists

	//Populate those playlists

	//Post those playlist states back to the server

	
	//Show a users's playlists. 
	$scope.showPlaylist = function(playlist) {
		$scope.currentPlaylist = playlist
	}

	//If the playlist does not belong to the current user, we should create a new playlist for that user with the version they want? 
	// Do we copy over the history for that playlist? 
});

function getPlaylistSongs(playlist){
	var songListIds = playlist.tracks.items.map(function (track){
		console.log(track.track.id);
		return track.track.id;
	});

	return songListIds;
}