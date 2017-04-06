var LocalStrategy = require('passport-local').Strategy

var User = require('../models/user')
var Helper = require('../models/helper')
var Employer = require('../models/employer')
var Mail = require('../models/mail')

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

// callback to validate Employer Singapore NRIC
function nricvalidator (value) {
  var nric = value.slice(1, 8)
  var nricarray = nric.split('').map(function (number) {
    return parseInt(number, 10)
  })
  var nricweightarray = [2, 7, 6, 5, 4, 3, 2]
  var sum = 0
  for (var i = 0; i < nricarray.length; i++) {
    sum += nricarray[i] * nricweightarray[i]
  }
  var firstletter = value.slice(0, 1).toUpperCase()
  if (firstletter === 'T' || firstletter === 'G') {
    sum += 4
  }
  var checkdigit = 11 - (sum % 11)
  var alphabetarray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'Z', 'J']
  if (firstletter === 'F' || firstletter === 'G') {
    alphabetarray = ['K', 'L', 'M', 'N', 'P', 'Q', 'R', 'T', 'U', 'W', 'X']
  }
  var lastletter = alphabetarray.slice(checkdigit - 1, checkdigit).toString()
  var valueletter = value.slice(8, 9).toUpperCase()
  if (lastletter === valueletter) {
    return true
  } else {
    return false
  }
}

module.exports = function (passport) {
  // add user id to session to simulate user has login
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  // remove user id from session to simulate no user login
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user)
    })
  })

  /**
  * @name Local-Login strategy
  *
  * Success if:
  *     email exists
  *     password correct
  *
  * Success redirect to User page
  *
  * Failure redirect to Login page
  */
  passport.use('local-login', new LocalStrategy({
    usernameField: 'user[local][email]',
    passwordField: 'user[local][password]',
    passReqToCallback: true
  }, function (req, email, password, next) {
    User.findOne({'local.email': email}, function (err, foundUser) {
      if (err) return next(err)
      if (foundUser) {
        foundUser.authenticate(password, function (err, passwordCorrect) {
          if (err) return next(err)
          if (passwordCorrect) {
            return next(null, foundUser)
          } else {
            return next(null, false, req.flash('loginMessage', 'Incorrect email or password.'))
          }
        })
      }
      if (!foundUser) {
        return next(null, false, req.flash('loginMessage', 'Sorry, this account does not exist.'))
      }
    })
  }))

  /**
  * @name Local-Signup strategy
  *
  * Create Account if:
  *     hidden input empty (prevent spam bots)
  *     email doesnt exist
  *     password and confirm match
  *     role is either helper or employer
  *         if employer, validate Singapore NRIC
  *
  * When Create Account:
  *     generate codestring (hashed when User save)
  *     Helper:
  *         activate false
  *         create new Helper with userid
  *         send email with activate code
  *     Employer:
  *         activate true
  *         create new Employer with userid
  *
  * Success redirect to User edit page
  *
  * Failure redirect to Signup page
  */
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'user[local][email]',
    passwordField: 'user[local][password]',
    passReqToCallback: true
  }, function (req, email, password, next) {
    if (req.body.user.local.pass === '') {
      User.findOne({'local.email': email}, function (err, foundUser) {
        if (err) return next(err)
        if (foundUser) {
          return next(null, false, req.flash('signupMessage', 'Sorry, this email has been taken.'))
        } else if (password !== req.body.user.local.confirm) {
          return next(null, false, req.flash('signupMessage', 'The passwords do not match.'))
        } else if (req.body.user.local.role === 'helper' || req.body.user.local.role === 'employer') {
          var codestring = generateCode(1).substring(0, 10)
          if (req.body.user.local.role === 'helper') {
            var newUser = new User({
              local: {
                email: email,
                password: password,
                role: req.body.user.local.role,
                identification: req.body.user.local.identification.toUpperCase()
              },
              activate: {
                status: false,
                code: codestring
              }
            })
            newUser.save(function (err, newUser) {
              if (err) { return next(null, false, req.flash('signupMessage', err.errors)) }
              var newHelper = new Helper({userid: newUser._id})
              newHelper.save(function (err, newHelper) {
                if (err) { return next(null, false, req.flash('signupMessage', err.errors)) }
                var newMail = new Mail({
                  from: 'support@twowls.com',
                  to: [{email: newUser.local.email}],
                  subject: 'Twowls Activate Account',
                  message: codestring,
                  substitutions: {
                    '-useremail-': newUser.local.email,
                    '-type-': 'Activate Account',
                    '-instructions-': 'Your activation code is:',
                    '-action-': 'or copy the link below to activate,',
                    '-href-': 'http://twowls.com/users/' + newUser._id + '/activate/' + codestring
                  },
                  templateid: '2c5688ca-c1b1-4a45-96f9-3e5ec49e4798'
                })
                newMail.sendEmail(newMail, function (err, response) {
                  if (err) { return next(null, false, req.flash('signupMessage', err.message)) }
                  if (response) { return next(null, newUser) }
                })
              })
            })
          } else {
            var regexEmployerNRIC = new RegExp(/^([S,T,s,t][0-9]{7}[A-J,Z,a-j,z])$|^([F,G,f,g][0-9]{7}[K-R,T-X,k-r,t-x])$/)
            if (regexEmployerNRIC.test(req.body.user.local.identification) && nricvalidator(req.body.user.local.identification)) {
              var newUserTwo = new User({
                local: {
                  email: email,
                  password: password,
                  role: req.body.user.local.role,
                  identification: req.body.user.local.identification.toUpperCase()
                },
                activate: {
                  status: true,
                  code: codestring
                }
              })
              newUserTwo.save(function (err, newUserTwo) {
                if (err) {
                  return next(null, false, req.flash('signupMessage', err.errors))
                }
                var newEmployer = new Employer({
                  userid: newUserTwo._id
                })
                newEmployer.save(function (err, newEmployer) {
                  if (err) {
                    return next(null, false, req.flash('signupMessage', err.errors))
                  }
                  return next(null, newUserTwo)
                })
              })
            } else {
              return next(null, false, req.flash('signupMessage', 'Invalid NRIC provided. Please provide the following format, \'S1234567D\''))
            }
          }
        } else {
          return next(null, false, req.flash('signupMessage', 'Please choose either Helper or Employer.'))
        }
      })
    } else {
      var err = {
        message: 'Something went wrong with your sign up request. Please refresh the page and try again.'
      }
      return next(err)
    }
  }))

  /**
  * @name Local-Admin strategy
  *
  * Success if:
  *     email is support@twowls.com
  *     email exists
  *     passwordreset field not expired (1 hour)
  *     password correct
  *     code correct
  *
  * Success redirect to admin menu page
  *     send email to Twowls, notify admin login
  *
  * Failure redirect to admin login page
  */
  passport.use('local-admin', new LocalStrategy({
    usernameField: 'user[local][email]',
    passwordField: 'user[local][password]',
    passReqToCallback: true
  }, function (req, email, password, next) {
    if (email === 'support@twowls.com') {
      User.findOne({'local.email': email}, function (err, foundUser) {
        if (err) return next(err)
        if (foundUser) {
          if (foundUser.local.passwordreset.timecreated > new Date(new Date().setHours(new Date().getHours() - 1))) {
            foundUser.authenticate(password, function (err, passwordCorrect) {
              if (err) return next(err)
              if (passwordCorrect) {
                foundUser.resetcodeauth(req.body.code, function (err, codeCorrect) {
                  if (err) return next(err)
                  if (codeCorrect) {
                    var newMail = new Mail({
                      from: 'support@twowls.com',
                      to: [{email: 'support@twowls.com'}],
                      bcc: [{email: 'alexwongweilun@hotmail.co.uk'}],
                      subject: 'Twowls Admin Login',
                      message: new Date().toUTCString(),
                      substitutions: {
                        '-useremail-': 'Admin',
                        '-type-': '',
                        '-instructions-': 'Twowls Admin, ' + foundUser.local.email + ', logged in at',
                        '-action-': '',
                        '-href-': ''
                      },
                      templateid: '2c5688ca-c1b1-4a45-96f9-3e5ec49e4798'
                    })
                    newMail.sendEmailBcc(newMail, function (err, response) {
                      if (err) { return next(null, false, req.flash('adminloginMessage', err.message)) }
                      return next(null, foundUser)
                    })
                  } else {
                    return next(null, false, req.flash('adminloginMessage', 'Incorrect email, password or code.'))
                  }
                })
              } else {
                return next(null, false, req.flash('adminloginMessage', 'Incorrect email, password or code.'))
              }
            })
          } else {
            return next(null, false, req.flash('adminloginMessage', 'Your code has expired.'))
          }
        } else {
          return next(null, false, req.flash('adminloginMessage', 'Sorry, this account does not exist.'))
        }
      })
    } else {
      return next(null, false, req.flash('adminloginMessage', 'You are not an administrator.'))
    }
  }))
}
