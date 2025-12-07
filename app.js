var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var messageRouter = require('./routes/myMessage');

var app = express();

/* -----------------------------------
   MongoDB Connection (Mongoose v9)
----------------------------------- */
mongoose
  .connect(process.env.MONGO_URL)   // ❌ No deprecated options
  .then(() => console.log("✔ MongoDB Connected to : ", process.env.MONGO_URL))
  .catch((err) => console.log("❌ MongoDB Error:", err));

/* -----------------------------------
   View Engine Setup
----------------------------------- */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* -----------------------------------
   Middlewares
----------------------------------- */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: "*",
  credentials: true
}));

/* -----------------------------------
   Session Setup
----------------------------------- */
app.use(session({
  secret: process.env.SESSION_SECRET || "defaultsecret",
  resave: false,
  saveUninitialized: true
}));

/* -----------------------------------
   Routes
----------------------------------- */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/", messageRouter);

/* -----------------------------------
   Catch 404
----------------------------------- */
app.use(function (req, res, next) {
  next(createError(404));
});

/* -----------------------------------
   Error Handler
----------------------------------- */
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
