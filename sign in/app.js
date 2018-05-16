var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var details = require('./routes/details');
var regist = require('./routes/regist');
var sign = require('./routes/sign');

var app = express();

/*mongodb url*/
var url = 'mongodb://localhost:27017/db';
// MongoClient.connect(url, (err, db) => {
//   if (err) console.error(err);
//   console.log('Succeed in connecting db');
//   db.close();
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* session */
app.use(session({
  secret: 'mmp',
  cookie: {
    maxAge: 36000,
  },
  rolling: false,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    url: url,
  })
}));

app.use('/regist', regist);
app.use('/', details);
app.use('/', sign);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;