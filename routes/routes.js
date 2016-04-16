//This is the file that handles interacting with our database (so, the playlist version control part of the project.)
//routes/routes.js

var express = require('express'); // not necessary in this file!
var mongoose = require('mongoose');
var Playlist = require('../models/playlistModel');

var routes = {
  getPlaylists: function(req, res) {
    Playlist.find({user: req.user.id}, 'playlistId', function(err, playlists) {
      // good practice to handle errors: (true throughout; I won't fix it everywhere)
      if (err) return res.status(500).json(err);
      res.json(playlists);
    });
  },
  getPlaylist: function(req, res) {
    Playlist.findOne({playlistId: req.params.playlistId}, function(err, playlist) {
      res.json(playlist);
    });
  },
  trackPlaylist: function(req, res) {
    var playlist = new Playlist({
      user: req.user.id,
      playlistId: req.body.id,
      states: [{
        songs: [req.body.songs],
        date: new Date()}]
    });

    playlist.save(function (err) {
      console.log(err);
      res.json({playlist: playlist, success: !err});
    });
  },
  savePlaylist: function(req, res) {
    // clean up your debugging mechanisms before submitting code! (true throughout)
    Playlist.findOne({playlistId: req.body.id}, function(err, playlist) {
      playlist.states.unshift({songs: req.body.songs, date: new Date()});
      playlist.save(function(err) {
        playlist.success = !err;
        res.json(playlist);
      })
    });
  },
  revertPlaylist: function(req, res) {
    Playlist.findOne({playlistId: req.body.id}, function(err, playlist) {
      console.log(playlist);
      console.log(req.body);
      var newState = playlist.states[req.body.state];
      newState.date = new Date();
      playlist.states.unshift(newState);
      playlist.save(function(err) {
        playlist.success = !err;
        res.json(playlist);
      })
    });
  },
  untrackPlaylist: function(req, res) {
    // Could multiple people be tracking a shared playlist?
    // (ie should this database call only remove *my* playlists with this particular playlist id?)
    // ...I think this comment might apply to updates/reverts of shared playlists, also
    Playlist.remove({playlistId: req.body.id}, function (err) {
      res.json({
        success: !err
      });
    });
  }
};

module.exports = routes;
