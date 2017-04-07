var User = require('../models/user')
var Mail = require('../models/mail')
var bcrypt = require('bcrypt')

// generateCode callback as mathRandom may be 0 or 1
function mathRandomError (min, max) {
  return Math.random() * (max - min) + min
}
function generateCode (loop) {
  var code = ''
  for (var i = 0; i < loop; i++) {
    var randomnumber = mathRandomError(0.0001, 0.9999)
    code += randomnumber.toString(36).substring(2, 22)
  }
  return code
}

// export functions to password routes
module.exports = {
  getAccountEmail: function (req, res) {
    res.render('password/index')
  },
  postAJAXForgotPassword: function (req, res, next) {
    if (req.user) {
      res.redirect('/users')
    } else {
      User.findOne({'local.email': req.body.email}, function (err, userInfo) {
        if (err) { return next(err) }
        if (userInfo) {
          var resetcode = generateCode(3)
          bcrypt.genSalt(5, function (err, salt) {
            if (err) { return next(err) }
            bcrypt.hash(resetcode, salt, function (err, hash) {
              if (err) { return next(err) }
              User.findOneAndUpdate({'local.email': req.body.email}, {
                'local.passwordreset.timecreated': new Date(),
                'local.passwordreset.resetcode': hash
              }, function (err, newInfo) {
                if (err) { return next(err) }
                var newMail = new Mail({
                  from: 'support@twowls.com',
                  to: [{email: newInfo.local.email}],
                  subject: 'Twowls Reset Password',
                  message: '24 hours!',
                  substitutions: {
                    '-useremail-': newInfo.local.email,
                    '-type-': 'Reset Password',
                    '-instructions-': 'This password reset will expire in',
                    '-action-': 'Click the button or copy the link below to reset your password,',
                    '-href-': 'http://maidicare.com/password/validate/' + newInfo._id + '&' + resetcode
                  },
                  templateid: 'cd40cf81-91bb-40db-8229-cbde1d35cf2e'
                })
                newMail.sendEmail(newMail, function (err, response) {
                  if (err) { return next(err) }
                  res.send({
                    status: 'success',
                    message: 'Please check your email, and reset within 24 hours.'
                  })
                })
              })
            })
          })
        } else {
          res.send({
            status: 'error',
            message: 'Could not find an account with email, \'' + req.body.email + '\'.'
          })
        }
      })
    }
  },
  getValidateCode: function (req, res, next) {
    if (req.user) {
      res.render('password/reset', {
        message: req.flash('passwordresetMessage')
      })
    } else {
      var userid = req.params.idcode.split('&')[0]
      var resetcode = req.params.idcode.split('&')[1]
      User.findOne({'_id': userid}, function (err, userInfo) {
        if (err) { return next(err) }
        if (userInfo) {
          userInfo.resetcodeauth(resetcode, function (err, codeCorrect) {
            if (err) { return next(err) }
            if (codeCorrect) {
              if (userInfo.local.passwordreset.timecreated > new Date(new Date().setDate(new Date().getDate() - 1))) {
                res.render('password/reset', {
                  message: req.flash('passwordresetMessage')
                })
              } else {
                req.flash('loginMessage', 'Error, the reset code expired. Please try again.')
                res.redirect('/login')
              }
            } else {
              req.flash('loginMessage', 'Error, invalid reset code. Please try again.')
              res.redirect('/login')
            }
          })
        } else {
          req.flash('loginMessage', 'Error, this account does not exist. Please try again.')
          res.redirect('/login')
        }
      })
    }
  },
  postAJAXChangePassword: function (req, res, next) {
    if (req.body.password.length >= 6 && req.body.confirm.length >= 6 && req.body.password === req.body.confirm) {
      bcrypt.genSalt(5, function (err, salt) {
        if (err) { return next(err) }
        bcrypt.hash(req.body.password, salt, function (err, hash) {
          if (err) { return next(err) }
          User.findOneAndUpdate({'_id': req.body.userid}, {
            'local.password': hash,
            'local.passwordreset.resetcode': hash,
            'local.passwordreset.timecreated': new Date()
          }, function (err) {
            if (err) { return next(err) }
            res.send({
              status: 'success',
              url: '/password/resetsuccess'
            })
          })
        })
      })
    } else {
      res.send({
        status: 'error',
        message: 'Passwords must match and be a minimum of 6 characters.'
      })
    }
  },
  getResetSuccess: function (req, res) {
    res.render('password/resetsuccess')
  }
}
