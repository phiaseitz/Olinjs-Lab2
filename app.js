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

//Modules from spotify authexample
var swig           = require('swig');
var methodOverride = require('method-override');
var consolidate    = require('consolidate');


// CONFIGURATION ===============================================================
app.use(logger('dev'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(methodOverride());
app.use(bodyParser())
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//FROM EXAMPLE -- WILL NEED TO REMOVE
app.engine('html', consolidate.swig);



// CONNECT TO DATABASE =========================================================
// mongoose.connect('mongodb://localhost/gitify');

// SECURITY CONFIGURATION ======================================================
var passport = auth.configure();
// app.use(session({
//   // store: new MongoStore({
//   //   mongooseConnection: mongoose.connection,
//   //   ttl: 24 * 60 * 60
//   // }),
//   secret: 'gitifysecretkey',
//   // resave: true,
//   // saveUninitialized: true
// }));
app.use(session({secret: "this is a secret"}));
app.use(passport.initialize());
app.use(passport.session())

// ROUTES ======================================================================

// GET requests

app.get('/', function(req, res){
  res.render('index.html', { user: req.user });
});

app.get('/account', auth.ensureAuthenticated, function(req, res){
  res.render('account.html', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login.html', { user: req.user });
});

// GET /auth/spotify
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in spotify authentication will involve redirecting
//   the user to spotify.com. After authorization, spotify will redirect the user
//   back to this application at /auth/spotify/callback
app.get('/auth/spotify', auth.spotifyAuth);

// GET /auth/spotify/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user will be redirected back to the
//   login page. Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/spotify/callback', auth.callback);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// AngularJS requests
// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/public/index.html');
// });

// START SERVER ================================================================
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log("Gitify running on port:", PORT);
});