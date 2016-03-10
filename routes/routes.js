//routes/routes.js

var express = require('express');
var mongoose = require('mongoose');
var Playlist = require('../models/playlistModel');

var routes = {
  getPlaylists: function(req, res) {
    Playlist.find({user: req.user.id}, 'playlistId', function(err, playlists) {
      res.json(playlists);
    });
  },
  getPlaylist: function(req, res) {
    Playlist.findOne({playlistId: req.body.id}, function(playlist) {
      res.json(playlist);
    });
  },
  trackPlaylist: function(req, res) {
    var playlist = new Playlist({
      user: req.user.id,
      playlistId: req.body.id,
      states: {
        songs: [req.body.songs],
        date: new Date()}
    });

    playlist.save(function (err) {
      console.log(err);
      res.json({playlist: playlist, success: !err});
    });
  },
  savePlaylist: function(req, res) {
    Playlist.findOne({playlistId: req.body.id}, function(playlist) {
      console.log(playlist)
      playlist.states.songs.unshift(req.body.songs);
      playlist.states.date.unshift(new Date())
      playlist.save(function(err) {
        playlist.success = !err;
        res.json(playlist);
      })
    });
  },
  revertPlaylist: function(req, res) {
    Playlist.findOne({playlistId: req.body.id}, function(playlist) {
      playlist.states.unshift(playlist[req.body.state]);
      playlist.save(function(err) {
        playlist.success = !err;
        res.json(playlist);
      })
    });
  },
  untrackPlaylist: function(req, res) {
    Playlist.remove({playlistId: req.body.id}, function (err) {
      res.json({
        success: !err
      });
    });
  }
};

module.exports = routes;