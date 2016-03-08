app.service('PlaylistService', function($http, $q) {

  this.requests = {
    GET: $http.get,
    POST: $http.post
  };

  this.send = function(method, action, data) {
    var confirmedPlaylist = $q.defer();
    this.requests[method](action, data).then(function (response) {
      confirmedPlaylist.resolve(response.data);
    }, function (error) {
      console.log('ERROR: Promise error in PlaylistService', error);
      confirmedPlaylist.reject(error);
    });
    return confirmedPlaylist.promise;
  };

  this.trackPlaylist = function(playlist, songList) {
    return this.send('POST', '/api/trackPlaylist/', {
      id: playlist,
      songs: songList
    });
  };

  this.savePlaylist = function(playlist, songList) {
    return this.send('POST', '/api/savePlaylist/', {
      id: playlist,
      songs: songList
    });
  };

  this.revertPlaylist = function(playlist, state) {
    return this.send('POST', '/api/revertPlaylist/', {
      id: playlist,
      state: state
    });
  };

  this.untrackPlaylist = function(playlist) {
    return this.send('POST', '/api/untrackPlaylist/', {
      id: playlist
    });
  };

  this.getPlaylists = function(playlists) {
    return this.send('GET', '/api/getPlaylists', {
      playlists: playlists
    });
  };

});