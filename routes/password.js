var express = require('express')
var router = express.Router()

var passwordController = require('../controller/passwordController')

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

/**
* @name Forgot Password
*
* render password index page
*
* post to change user passwordreset fields
*     user, redirected (prevent troublemakers)
*
*     non-user, AJAX Post email for reset
*         if email exists in db
*             change passwordreset fields & hash new resetcode
*             send password/validate/:idcode via sendgrid mail
*             response success for swal2
**/
router.route('/forgot')
      .get(loginCheck, passwordController.getAccountEmail)
      .post(passwordController.postAJAXForgotPassword)

/**
* @name Validate Passwordreset fields
*
* GET request
*     if user, render page
*
*     else non-user must validate
*         split :idcode values by &
*         check if userid exists
*         check if resetcode correct using user method: resetcodeauth
*         check if resetcode expired (1 day)
*             both true, render password reset page so can reset
**/
router.get('/validate/:idcode', passwordController.getValidateCode)

/**
* @name AJAX Post New Passwords
*
* using window.location.pathname to extract :id
(cause both user and non-user can post)
* check if password length > 6 and match
*     true, AJAX Post JSON (userid and passwords)
*         backend
*         check password again
*             true, hash and update both password & resetcode
*             response with swal2 object and url
*                 redirected to /password/resetsuccess
**/
router.post('/reset', passwordController.postAJAXChangePassword)

/**
* @name Password Resetsuccess page
*
* render password index page
*     if user, show users page link
*     else non-user, show login page link
*/
router.get('/resetsuccess', passwordController.getResetSuccess)

module.exports = router
