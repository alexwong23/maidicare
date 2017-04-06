var express = require('express')
var router = express.Router()
var passport = require('passport')

var User = require('../models/user')

var adminController = require('../controller/adminController')

// login check function for admin only
function loginCheck (req, res, next) {
  if (req.isAuthenticated(req, res, next)) {
    if (req.user.local.email === 'support@maidicare.com') {
      req.flash('adminMessage', 'You are already logged in!')
      return res.redirect('/admin')
    } else {
      req.flash('userMessage', 'You do not have access to this page.')
      return res.redirect('/users')
    }
  } else {
    return next()
  }
}
// admin check, if not admin, redirected back
function adminCheck (req, res, next) {
  if (req.isAuthenticated(req, res, next)) {
    if (req.user.local.role === 'admin' & req.user.local.email === 'support@maidicare.com') {
      return next()
    } else {
      req.flash('userMessage', 'You do not have access to this page.')
      return res.redirect('/users')
    }
  } else {
    req.flash('adminloginMessage', 'You have not logged in!')
    return res.redirect('/admin/login')
  }
}
// idrole check, ensure id and role valid, prevent error
function idroleCheck (req, res, next) {
  var userid = req.params.idrole.split('&')[0]
  var userrole = req.params.idrole.split('&')[1]
  User.findOne({'_id': userid, 'local.role': userrole}, function (err, userFound) {
    if (err) { return next(err) }
    if (userFound) {
      next()
    } else {
      req.flash('adminMessage', 'Invalid role of ' + userrole)
      res.redirect('/admin')
    }
  })
}

// admin login route with get and post, post with passport
router.route('/login')
    .get(loginCheck, adminController.getLogin)
    .post(passport.authenticate('local-admin', {
      successRedirect: '/admin',
      failureRedirect: '/admin/login',
      failureFlash: true
    }))

// Render Admin home page
router.get('/', adminCheck, adminController.getAdminHomePage)

// AJAX post create admin account and send new code
router.post('/newcode', adminController.postAJAXNewCode)

// Render admin send email page
router.route('/email')
      .get(adminCheck, adminController.getAdminEmailPage)
      .post(adminCheck, adminController.postAdminEmailPage)

// Post Search for email, redirect to users/:id
router.post('/users/search', adminController.postAdminUsersSearch)

// Render User account page for admin change email, nric and permissions
router.route('/users/:idrole')
      .get(adminCheck, idroleCheck, adminController.getAdminUsersAccount)
      .put(idroleCheck, adminController.putAdminUsersAccount)

// Render User details page for admin to change user details
// similar to User edit
router.route('/users/:idrole/edit')
      .get(adminCheck, idroleCheck, adminController.getAdminUsersEdit)
      .put(idroleCheck, adminController.putAdminUsersEdit)

// Render User shortlists for admin to view User's shortlists
// similar to user shortlists
router.get('/users/:idrole/shortlists', adminCheck, idroleCheck, adminController.getAdminUsersHire)

// Render shortlists based on status
router.get('/shortlists/all/:status', adminCheck, adminController.getAdminAllHire)

// Render shortlists based on id
// AJAX Post changes hire status
router.route('/shortlists/:id')
      .get(adminCheck, adminController.getAdminHire)
      .post(adminCheck, adminController.postAJAXAdminHire)

// Render inactive helpers for admin to view & email warning
router.route('/inactive/helpers')
      .get(adminCheck, adminController.getAdminInactiveHelpers)
      .post(adminCheck, adminController.postAJAXAdminInactiveHelpersAll)

// Admin emails warning to individual inactive helper
router.post('/inactive/helpers/:id', adminCheck, adminController.postAJAXAdminInactiveHelpersIndiv)

// Render inactive shortlists for admin to view & mail indiv warnings
router.route('/inactive/shortlists')
      .get(adminCheck, adminController.getAdminInactiveHire)
      .post(adminCheck, adminController.postAJAXAdminInactiveHire)

module.exports = router
