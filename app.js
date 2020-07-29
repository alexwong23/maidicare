// var newrelic = require('newrelic')

// require modules & set to variables
var express = require('express')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var mongoose = require('mongoose')
var layout = require('express-ejs-layouts')
var dotenv = require('dotenv')
var flash = require('connect-flash')
var session = require('express-session')
var path = require('path')
var passport = require('passport')
var MongoStore = require('connect-mongo')(session)
var helmet = require('helmet')
// var morgan = require('morgan')
var compression = require('compression')

// set app to run express
// compress response bodies for all requests
// server variable for web socket at btm of page
var app = express()
app.use(compression())
var server = require('http').Server(app)

// connect mongoose to which environment
mongoose.Promise = global.Promise

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_ENV = 'local'
}

console.log('the environment is on ' + process.env.NODE_ENV)
dotenv.load({path: '.env.' + process.env.NODE_ENV})
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true
})

// comment out morgan to prevent clogging of terminal
// set view engine to ejs and use layout
// set session, initialize passport, session, flash
// store data in mongodb, use public folder
// app.use(morgan('dev'))
app.set('view engine', 'ejs')
// https://expressjs.com/en/advanced/best-practice-security.html
app.use(helmet())
app.use(layout)
app.set('trust proxy', 1)
app.use(session({
  secret: process.env.EXPRESS_SECRET,
  name: 'sessionID',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000 // 1 hour
  },
  store: new MongoStore({
    url: process.env.MONGO_URI,
    autoReconnect: true
  })
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
// enable cache & add maxage for browser cache
if (app.get('env') !== 'local') {
  app.set('view cache', true)
  app.use(express.static(path.join(__dirname, 'public'), { maxage: '1h' }))
  // app.disable('view cache') // disable cache for development (not sure work)
}
app.use(express.static(path.join(__dirname, 'public')))

// set routes to variables
var indexRoutes = require('./routes/index')
var userRoutes = require('./routes/user')
var browseRoutes = require('./routes/browse')
var passwordRoutes = require('./routes/password')
var apiRoutes = require('./routes/api')
var adminRoutes = require('./routes/admin')

// body parser to get req.body from web page
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// for passport
require('./config/passport')(passport)

// run methodOverride for all requests
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

// exclusively for getting external api
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// to call 'user' in ejs pages, depends on session user id
app.use(function (req, res, next) {
  res.locals.user = req.user
  next()
})

// connect routes to url
app.use('/', indexRoutes)
app.use('/users', userRoutes)
app.use('/browse', browseRoutes)
app.use('/password', passwordRoutes)
app.use('/api', apiRoutes)
app.use('/admin', adminRoutes)

// Handle 404
app.use(function (req, res) {
  res.status(404)
  res.render('error', {
    title: '404',
    error: 'Page not found :(',
    message: 'Unfortunately, this page does not exist.'
  })
})

var url = require('url')
var Mail = require('./models/mail')
// Handle 500 & send email alert
app.use(function (err, req, res, next) {
  var user = 'A normal user '
  if (req.user) { user = req.user.local.email }
  var newMail = new Mail({
    from: 'support@maidicare.com',
    to: [{email: 'support@maidicare.com'}],
    bcc: [{email: 'alexwongweilun@hotmail.co.uk'}],
    subject: 'MaidiCare: Internal Error',
    message: err,
    substitutions: {
      '-date-': new Date().toUTCString(),
      '-user-': user,
      '-url-': url.parse(req.url).pathname
    },
    templateid: '345b5afb-2d19-46e8-8798-381fefe27eca'
  })
  newMail.sendEmailBcc(newMail, function (err, response) {
    if (err) { }
    if (app.get('env') !== 'local') {
      err = 'Unexpected Error :('
    }
    res.status(500)
    res.render('error', {
      title: 500,
      error: err,
      message: 'An error occurred and your request could not be completed. Please try again or'
    })
  })
})

// server listen if either on heroku or localhost
server.listen(process.env.PORT || 4000)
console.log('Server running at http://localhost:4000/')
