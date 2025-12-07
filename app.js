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
   MongoDB Connection (Mongoose v9+)
----------------------------------- */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✔ MongoDB Connected"))
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
  origin: "*"
}));

/* -----------------------------------
   REMOVE sessions for production
----------------------------------- */
// ❌ Remove express-session completely
// ❌ No MemoryStore 
// ❌ No session crashes on mobile

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
