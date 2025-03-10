var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const sessionConfig = require('./config/sessionConfig');
// const flash = require("express-flash");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRoutes');
var quizRouter = require('./routes/quizRoutes');
var questionRouter = require('./routes/questionRoutes');

var app = express();
require('dotenv').config(); 

// Kết nối MongoDB
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Cấu hình view engine EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware: Truyền biến user vào EJS templates
app.use((req, res, next) => {
  res.locals.user = null; // Mặc định user = null
  next();
});

app.use(sessionConfig);

app.use((req, res, next) => {
  res.locals.session = req.session; // Truyền session vào tất cả EJS views
  next();
});

const flash = require("connect-flash");
app.use(flash());

app.use((req, res, next) => {
  res.locals.errorMessage = req.flash("error");
  next();
});

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));  // Hỗ trợ PUT & DELETE từ form
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/quizzes', quizRouter);
app.use('/questions', questionRouter);
app.use('/auth', require('./routes/authRoutes'));

// Xử lý lỗi 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Xử lý lỗi chung
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
