require('dotenv').config();

const express = require('express');
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const { store } = require('./src/firebase');

const authRouter = require('./routes/auth');
const apiV1Router = require('./routes/apiV1');

require('./src/auth')();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../build')));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: store,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1', apiV1Router);
app.use('/', authRouter);

// Error handlers

// not found
app.use(function (req, res, next) {
  res.status(404);

  res.format({
    // html: function () {
    //   res.render('404', { url: req.url })
    // },
    json: function () {
      res.json({ error: 'Not found' });
    },
    default: function () {
      res.type('txt').send('Not found');
    },
  });
});

// error
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.send(500, 'Ooops!');
});

module.exports = app;
