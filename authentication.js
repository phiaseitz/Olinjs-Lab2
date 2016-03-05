var passport        = require('passport');
var apiKeys            = require('./apiKeys.js');
var SpotifyStrategy = require('passport-spotify').Strategy;



var authentication = {};

authentication.configure = function() {
  // Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete spotify profile is serialized
//   and deserialized.
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });


    // Use the SpotifyStrategy within Passport.
  //   Strategies in Passport require a `verify` function, which accept
  //   credentials (in this case, an accessToken, refreshToken, and spotify
  //   profile), and invoke a callback with a user object.
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
};

authentication.spotifyAuth = function (req, res, next){
  console.log('spotifyAuth')
  passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private'], showDialog: true})(req, res, next)
};

authentication.callback = function (req, res, next){
  passport.authenticate('spotify', { failureRedirect: '/login', successRedirect: '/' })(req, res, next)
}

authentication.ensureAuthenticated = function(req, res, next){
  if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}

module.exports = authentication;