//This is the service that handles talking to our database from the frontend. We've defined functions that we can call to interact with routes that
// manage our playlist version control. The functions should be fairly self-explanatory
app.service('PlaylistService', function($http, $q) {
  // This is basically an API wrapper -- provides you w/ clientside methods you can call
  // which talk to your server. You might also see factories used for this purpose, instead of services --
  // the two are almost identical, but factories are a little more flexible.
  // Here's an explanation I like: http://weblogs.asp.net/dwahlin/using-an-angularjs-factory-to-interact-with-a-restful-service

  this.requests = {
    GET: $http.get,
    POST: $http.post
  };

  this.send = function(method, action, data) {
    var confirmedPlaylist = $q.defer();
    this.requests[method](action, data || {}).then(function (response) {
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

  this.getPlaylist = function(playlist) {
    return this.send('GET', '/api/getPlaylist/' + playlist);
  };

  this.getPlaylists = function(user) {
    return this.send('GET', '/api/getPlaylists');
  };

});
