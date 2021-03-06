// This is the file that creates and sets up the app. Here we intitialize our express app, connect to mongo, and define some of the routes.
// app.js

// MODULE IMPORTS ==============================================================

// utility modules
var path           = require('path');
var logger         = require('morgan');
var cookieParser   = require('cookie-parser');

// express modules
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');

// database modules
var mongoose       = require('mongoose');

// route modules
var routes         = require('./routes/routes');

// authentication modules
var auth           = require('./authentication.js');
var session        = require('express-session');
var MongoStore     = require('connect-mongo')(session);

// CONFIGURATION ===============================================================
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CONNECT TO DATABASE =========================================================
mongoose.connect('mongodb://localhost/gitify');

// SECURITY CONFIGURATION ======================================================
var passport = auth.configure();
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60
  }),
  secret: 'gitifysecretkey',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session())

// ROUTES ======================================================================

// GET requests
app.get('/auth/spotify', auth.spotifyAuth);
app.get('/auth/spotify/callback', auth.callback);
app.get('/logout', auth.logout);
app.get('/api/getAuthenticated', auth.sendAuthentication);
app.get('/api/getPlaylists', routes.getPlaylists);
app.get('/api/getPlaylist/:playlistId', routes.getPlaylist);

// POST requests
app.post('/api/trackPlaylist', routes.trackPlaylist);
app.post('/api/savePlaylist', routes.savePlaylist);
app.post('/api/revertPlaylist', routes.revertPlaylist);
app.post('/api/untrackPlaylist', routes.untrackPlaylist);

// AngularJS requests
app.get('*', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// START SERVER ================================================================
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log("Gitify running on port:", PORT);
});