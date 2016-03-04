var passport        = require('passport');
var SpotifyStrategy = require('passport-spotify').Strategy;
var keys            = require('./apiKeys.js');

var authentication = {
  configure: function() {
    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
      done(null, obj);
    });
    passport.use(new SpotifyStrategy({
        clientID: keys.spotify.clientID,
        clientSecret: keys.spotify.clientSecret,
        callbackURL: "http://localhost:3000/auth/spotify/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        return done(err, profile);
      }
    ));
    return passport;
  },
  ensureAuthenticated: function(req, res, next) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      
      return next();
    }
    res.redirect('/login');
  },
  sendAuthentication: function(req, res, next) {
    res.status(200).json({
      authenticated: req.isAuthenticated()
    });
  },
  login: function(req, res, next) {
    console.log('login');
    passport.authenticate('spotify', { failureRedirect: '/login' })(req, res, next);
  },
  callback: function(req, res, next) {
    passport.authenticate('spotify', {
      successRedirect: '/',
      failureRedirect: '/login'
    });
  },
  logout: function(req, res){
    req.logout();
    res.redirect('/');
  }
};

module.exports = authentication;