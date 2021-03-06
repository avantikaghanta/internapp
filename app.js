var createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose= require('mongoose');
const bodyparser = require("body-parser");

var indexRouter = require('./routes/index');
const userRouter = require('./api/router/user');
const auditRouter = require('./api/router/audit');
const checklistRouter = require('./api/router/checklist');
const app = express();


const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017/confusion";
const databaseName = "confusion";

MongoClient.connect(uri, { useNewUrlParser: true ,useUnifiedTopology: true }, (error, client) => {
  if (error) {
    return console.log("Connection failed for some reason");
  }
  console.log("Connection established - All well");
  const db = client.db(databaseName);
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/checklist', checklistRouter);
app.use('/audit', auditRouter);


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
