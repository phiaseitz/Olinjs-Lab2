var passport        = require('passport');
var apiKeys         = require('./apiKeys.js');
var SpotifyStrategy = require('passport-spotify').Strategy;

var authentication = {
  configure:function() {
    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
      done(null, obj);
    });
    passport.use(new SpotifyStrategy({
      clientID: apiKeys.spotify.clientID,
      clientSecret: apiKeys.spotify.clientSecret,
      callbackURL: 'http://localhost:3000/auth/spotify/callback'
      },
      function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
          // To keep the example simple, the user's spotify profile is returned to
          // represent the logged-in user. In a typical application, you would want
          // to associate the spotify account with a user record in your database,
          // and return that user instead.
          return done(null, profile);
        });
    }));
    return passport;
  },

  spotifyAuth: function (req, res, next){
    console.log('spotifyAuth')
    passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private'], showDialog: true})(req, res, next)
  },

  callback: function (req, res, next){
    passport.authenticate('spotify', { failureRedirect: '/login', successRedirect: '/' })(req, res, next)
  },

  ensureAuthenticated: function(req, res, next){
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
  },

  sendAuthentication: function(req, res, next){
    if (req.isAuthenticated()){
      res.json({
        authenticated: true, 
        user: req.user,
      })
    } else {
      res.json({
        authenticated: false,
      })
    }
  },
  logout: function(req, res, next) {
      req.logout();
      next();
  }
}

module.exports = authentication;