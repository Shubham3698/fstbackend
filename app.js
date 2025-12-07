var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// MongoDB Connection
const mongoose = require("mongoose");
async function connectDB() {
  try {
    await mongoose.connect("mongodb+srv://shubham123:pandey123@cluster0.lzs2dru.mongodb.net/fstback", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB Connected ✔");
  } catch (error) {
    console.error("MongoDB Connection Error ❌", error);
  }
}
connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// session
app.use(session({
  secret: "shubham123",
  resave: false,
  saveUninitialized: true,
}));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 404 handler
app.use(function(req, res, next) {
  res.status(404).send("Page Not Found");
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
