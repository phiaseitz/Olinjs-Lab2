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
    // this is embedding -- ok with me because the states are pretty simple and don't change once
    // they're stored, but know that referencing is an option for more complicated model structures
    type: [State],
    required: true
  }
});

module.exports = mongoose.model('playlists', Playlist);
