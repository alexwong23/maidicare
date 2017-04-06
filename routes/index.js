var express = require('express')
var router = express.Router()
var passport = require('passport')

var indexController = require('../controller/indexController')

// login check function
// if user is already login, redirect to user page with flash
// if user is not login, allow codes to continue
function loginCheck (req, res, next) {
  if (req.isAuthenticated(req, res, next)) {
    req.flash('userMessage', 'You are already logged in!')
    return res.redirect('/users')
  } else {
    return next()
  }
}

// Standard render and logout
router.get('/', indexController.getHome)
router.get('/logout', indexController.getLogout)
router.get('/about', indexController.getAbout)
router.get('/help', indexController.getHelp)

// AJAX Post for Loading Contact Us fields
//     Sent when user logged in and render AboutUs Page
//     Returns Users Name and email
router.post('/loadcontactus/:idrole', indexController.postAJAXLoadContactUs)

// AJAX Post for Contact us form
//     Checks for spam bots using hidden input
//     Sends email to support email
router.post('/contactus', indexController.postAJAXContactUs)

// login route with get and post, post with passport
router.route('/login')
.get(loginCheck, indexController.getLogin)
.post(passport.authenticate('local-login', {
  successRedirect: '/users',
  failureRedirect: '/login',
  failureFlash: true
}))

// signup route with get and post, post with passport
router.route('/signup')
  .get(loginCheck, indexController.getSignup)
  .post(passport.authenticate('local-signup', {
    successRedirect: '/users/edit',
    failureRedirect: '/signup',
    failureFlash: true
  }))

module.exports = router
