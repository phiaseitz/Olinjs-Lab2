//routes/routes.js

var express = require('express');
var mongoose = require('mongoose');
var Playlist = require('../models/playlistModel');

var routes = {
  getPlaylists: function(req, res) {
    Playlist.find({user: req.body.user}, function(playlists) {
      res.json(playlists);
    });
  },
  getPlaylist: function(req, res) {
    Playlist.findOne({id: req.body.id}, function(playlist) {
      res.json(playlist);
    });
  },
  trackPlaylist: function(req, res) {
    Playlist.create({
      user: req.user._id,
      id: req.body.id,
      states: [req.body.songs]
    }, function (err, playlist) {
      playlist.success = !err;
      res.json(playlist);
    });
  },
  savePlaylist: function(req, res) {
    Playlist.findOne({id: req.body.id}, function(playlist) {
      playlist.states.unshift(req.body.songs);
      playlist.save(function(err) {
        playlist.success = !err;
        res.json(playlist);
      })
    });
  },
  revertPlaylist: function(req, res) {
    Playlist.findOne({id: req.body.id}, function(playlist) {
      playlist.states.unshift(playlist[req.body.state]);
      playlist.save(function(err) {
        playlist.success = !err;
        res.json(playlist);
      })
    });
  },
  untrackPlaylist: function(req, res) {
    Playlist.remove({id: req.body.id}, function (err) {
      res.json({
        success: !err
      });
    });
  }
};

module.exports = routes;