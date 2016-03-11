// public/js/controllers/HomeController.js
app.controller('HomeController', function($scope, AuthService, PlaylistService, Spotify) {
	$scope.currentPlaylist = {
	};

	//Get the playlists that the user is tracking!
	PlaylistService.getPlaylists(AuthService.permissions.user.id).then(function(playlists){
		var playlistIds = playlists.map(function(playlist){
			return playlist.playlistId;
		});

		$scope.trackedPlaylists = playlistIds || [];

		// Spotify Auth stuff. This is the authentication token we get when we 
		// authenticate with passport-spotify. 
		Spotify.setAuthToken(AuthService.permissions.user.accessToken);

		// Get the user's playlists. 
		Spotify.getUserPlaylists(AuthService.permissions.user.id).then(function (data){

			var userPlaylists = data.items.filter(function(playlist){
				console.log(playlist);
				return AuthService.permissions.user.id == playlist.owner.id;
			})
			$scope.userPlaylists = userPlaylists.sort(function (a,b){
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
			if (response.success) {
				playlist.isTracked = true;
			}
		})	
	}


	$scope.trackPlaylist = function(playlist){
		var songListIds = playlist.tracks.items.map(function (track){
			return track.track.id;
		})
		PlaylistService.trackPlaylist(playlist.id, songListIds).then(function(response){
			if (response.success) {
				playlist.isTracked = true;
			}
		})
		
	}

	$scope.untrackPlaylist = function(playlist){
		PlaylistService.untrackPlaylist(playlist.id).then(function(response){
			if (response.success) {
				playlist.isTracked = false;
			}
		})
		
	}


	$scope.commitPlaylist =  function(playlist){
		PlaylistService.savePlaylist(playlist.id, getPlaylistSongs(playlist)).then(function(response){
			playlist.states = response.states
		});
	}

	
	//Show a users's playlists. 
	$scope.showPlaylist = function(playlist) {
		if (playlist.tracks.items) {
			playlist.displayedState = playlist.nowState;
			$scope.currentPlaylist = playlist;
		}
		else {
			Spotify.getPlaylist(playlist.owner.id, playlist.id).then(function(populatedPlaylist){
				playlist.tracks = populatedPlaylist.tracks;
				// console.log(populatedPlaylist.tracks)

				//if the playlist is a currently tracked playlist, add that to the playlist object
				if ($scope.trackedPlaylists.indexOf(playlist.id) >= 0){
					PlaylistService.getPlaylist(playlist.id).then(function(playlistRecord) {
						playlist.isTracked = true;
						var playlistStates = playlistRecord.states.map(function(state){
							state.isPopulated = false;
							return state
						})
						playlist.states = playlistStates;
					})
				} else {
					playlist.isTracked = false;
				}

				playlist.displayedStateIndex = -1;

				playlist.nowState = { songs: getPlaylistSongs(playlist),
									songTitles: getTrackTitles(playlist.tracks.items,true),}

				playlist.displayedState = playlist.nowState;
				$scope.currentPlaylist = playlist;
			});
		}
		
	}

	$scope.updateDisplayedState = function(){
		if ($scope.displayedStateIndex == -1) {
			$scope.currentPlaylist.displayedState = $scope.currentPlaylist.nowState;
		} else {
			var currentState = $scope.currentPlaylist.states[$scope.currentPlaylist.displayedStateIndex];
			if (currentState.isPopulated) {
				$scope.currentPlaylist.displayedState = { songs: currentState.songs,
														songTitles: currentState.songTitles};
			} else {
				Spotify.getTracks(currentState.songs).then(function(hydratedSongs){
					currentState.isPopulated = true;
					currentState.songTitles = getTrackTitles(hydratedSongs.tracks);
					$scope.currentPlaylist.displayedState = { songs: currentState.songs,
														songTitles: currentState.songTitles};	
				})
			}
		}
	}

	$scope.revert = function() {
		PlaylistService.revertPlaylist($scope.currentPlaylist.id,
			  $scope.currentPlaylist.displayedStateIndex).then(function(playlist) {
			Spotify.replacePlaylistTracks(AuthService.permissions.user.id,
					$scope.currentPlaylist.id, playlist.states[0].songs.join(','))
			.then(function(data) {
				$scope.currentPlaylist.tracks = {};
				$scope.showPlaylist($scope.currentPlaylist);
			});
			

		});
	};

	//If the playlist does not belong to the current user, we should create a new playlist for that user with the version they want? 
	// Do we copy over the history for that playlist? 
});

function getPlaylistSongs(playlist){
	var songListIds = playlist.tracks.items.map(function (track){
		return track.track.id;
	});

	return songListIds;
}

function getTrackTitles(tracks, isPlaylist){
	var songListTitles;
	if (isPlaylist){
		songListTitles = tracks.map(function (track){
			return track.track.name;
		});
	//This is a list of songs (organized differently from a playlist)
	} else {
		songListTitles = tracks.map(function (track){
			return track.name;
		});
	}
	

	return songListTitles;
}
