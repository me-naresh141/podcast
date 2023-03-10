var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
let mongoose = require('mongoose')
let session = require('express-session')
let MongoStore = require('connect-mongo')
let flash = require('connect-flash')
require('dotenv').config()

mongoose.set('strictQuery', true)

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
let podcastRouter = require('./routes/podcast')

let auth = require('./middelware/auth')
// connect database
mongoose.connect('mongodb://localhost/podcast', (err) => {
  console.log(err ? err : 'sucessfully connected')
})

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// session middelware
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/podcast' }),
  }),
)
//  flash message  middelware
app.use(flash())

// userinfi middelware
app.use(auth.userInfo)

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/podcast', podcastRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
