var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var messageRouter = require('./routes/myMessage');

var app = express();

/* -----------------------------------
   MongoDB Connection
----------------------------------- */
mongoose
  .connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✔ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err.message));

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

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.static(path.join(__dirname, 'public')));

/* -----------------------------------
   Routes
----------------------------------- */
app.get("/test", (req, res) => {
  res.json({ success: true, msg: "Backend Running Successfully!" });
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/message', messageRouter);

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
  console.error("❌ ERROR:", err.message);

  if (req.xhr || req.headers.accept?.includes("json")) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
