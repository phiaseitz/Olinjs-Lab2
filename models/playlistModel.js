// Playlist model. This is the format that we want to store the playlists in the database. 
var mongoose = require('mongoose');

var State = mongoose.Schema({
  songs: {
    type: [String],
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

var Playlist = mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  playlistId: {
    type: String,
    required: true
  },
  states: {
    type: [State],
    required: true
  }
});

module.exports = mongoose.model('playlists', Playlist);