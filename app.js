const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoose = require('mongoose');
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const moment = require('moment-timezone');

const indexRouter = require('./routes/index');

const app = express();

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'Brm6yHqAEoWYY9EpH2XPHKPbgVBVi2jdH8g',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

moment.tz.setDefault("Asia/Singapore");

app.use((req, res, next) => {
  res.locals = {};

  res.locals.moment = moment;

  res.locals.type = req.session.type;
  res.locals._id = req.session._id;
  res.locals.email = req.session.email;
  res.locals.firstname = req.session.firstname;
  res.locals.lastname = req.session.lastname;
  next()
});

app.use('/', indexRouter);


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
  err.status = err.status || 500
  res.status(err.status);

  if (err.status == 500) {
    res.render('error', { error500: true });
    return;
  }

  res.render('error');
});

module.exports = app;
