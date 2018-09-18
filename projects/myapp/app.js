var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');
var redis = require('redis');
var RedisStore = require('connect-redis')(session);
var config = require('./config/config.json');
//var client = redis.createClient();
var redisClient = redis.createClient({host: '13.209.250.199', port: 6379});

const passport = require('passport');
const passportConfig = require('./passport');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const { sequelize } = require('./models');

var app = express();
sequelize.sync();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

passportConfig(passport);

app.use(session({
  store: new RedisStore({client: redisClient }),
  key: config.session.key,
  secret: config.session.secret,
  cookie: {
    maxAge: 1000 * 60 * 60
  },
  saveUninitialized: false,
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


/**
 * http://usejsdoc.org/
 */

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});