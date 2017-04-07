var User = require('../models/user')
var Helper = require('../models/helper')
var Employer = require('../models/employer')
var Hire = require('../models/hire')
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

// export functions to index route
module.exports = {
  getLogin: function (req, res) {
    res.render('admin/login', { message: req.flash('adminloginMessage') })
  },
  postAJAXNewCode: function (req, res, next) {
    var resetCode = generateCode(2)
    bcrypt.genSalt(5, function (err, salt) {
      if (err) { return next(err) }
      bcrypt.hash(resetCode, salt, function (err, hash) {
        if (err) { return next(err) }
        User.findOneAndUpdate({'local.email': 'support@maidicare.com'}, {
          'local.passwordreset.timecreated': new Date(),
          'local.passwordreset.resetcode': hash
        }, function (err, adminFound) {
          if (err) { return next(err) }
          if (adminFound) {
            var newMail = new Mail({
              from: 'support@maidicare.com',
              to: [{email: 'support@maidicare.com'}],
              subject: 'MaidiCare Admin Code',
              message: 'One hour!',
              substitutions: {
                '-useremail-': 'Admin',
                '-type-': new Date().toUTCString(),
                '-instructions-': 'This code will expire in ',
                '-action-': resetCode,
                '-href-': ''
              },
              templateid: 'cd40cf81-91bb-40db-8229-cbde1d35cf2e'
            })
            newMail.sendEmail(newMail, function (err, response) {
              if (err) { return next(err) }
              res.send({status: 'success'})
            })
          } else {
            var newUser = new User({
              local: {
                email: 'support@maidicare.com',
                password: '36Emasurai*',
                role: 'admin',
                identification: 'admin',
                passwordreset: {
                  timecreated: new Date(),
                  resetcode: hash
                }
              },
              activate: {
                status: true,
                code: hash
              }
            })
            newUser.save(function (err, newUser) {
              if (err) { return next(err) }
              var newMail = new Mail({
                from: 'support@maidicare.com',
                to: [{email: 'support@maidicare.com'}],
                subject: 'MaidiCare Admin Code',
                message: 'One hour!',
                substitutions: {
                  '-useremail-': 'Admin',
                  '-type-': new Date().toUTCString(),
                  '-instructions-': 'This code will expire in ',
                  '-action-': resetCode,
                  '-href-': ''
                },
                templateid: 'cd40cf81-91bb-40db-8229-cbde1d35cf2e'
              })
              newMail.sendEmail(newMail, function (err, response) {
                if (err) { return next(err) }
                res.send({status: 'success'})
              })
            })
          }
        })
      })
    })
  },
  getAdminHomePage: function (req, res) {
    res.render('admin/index', { message: req.flash('adminMessage') })
  },
  getAdminEmailPage: function (req, res) {
    res.render('admin/email', {message: req.flash('adminEmailMessage')})
  },
  postAdminEmailPage: function (req, res, next) {
    var newMail = new Mail({
      from: 'support@maidicare.com',
      to: [{email: req.body.to}],
      bcc: [{email: 'support@maidicare.com'}],
      subject: req.body.subject,
      message: req.body.message,
      substitutions: {
        '-subject-': req.body.subject,
        '-to-': req.body.to
      },
      templateid: '2bf8b73a-9a01-4646-93a7-e09e632f372a'
    })
    newMail.sendEmailBcc(newMail, function (err, response) {
      if (err) {
        req.flash('adminEmailMessage', err.message)
        res.redirect('/admin/email')
      }
      req.flash('adminEmailMessage', 'SUCCESS! Mail was sent to ' + req.body.to + '. View it at support@maidicare.com')
      res.redirect('/admin/email')
    })
  },
  postAdminUsersSearch: function (req, res, next) {
    User.findOne({'local.email': req.body.email}, function (err, userInfo) {
      if (err) { return next(err) }
      if (userInfo) {
        res.redirect('/admin/users/' + userInfo._id + '&' + userInfo.local.role)
      } else {
        req.flash('adminMessage', 'Could not find any users with email, \'' + req.body.email + '\'.')
        res.redirect('/admin')
      }
    })
  },
  getAdminUsersAccount: function (req, res, next) {
    var userid = req.params.idrole.split('&')[0]
    var userrole = req.params.idrole.split('&')[1]
    if (userrole === 'helper') {
      Helper.findOne({'userid': userid})
      .populate('userid')
      .exec(function (err, userInfo) {
        if (err) { return next(err) }
        res.render('admin/user/index', {
          message: req.flash('adminUserAccountMessage'),
          userInfo: userInfo
        })
      })
    } else if (userrole === 'employer') {
      Employer.findOne({'userid': userid})
      .populate('userid')
      .exec(function (err, userInfo) {
        if (err) { return next(err) }
        res.render('admin/user/index', {
          message: req.flash('adminUserAccountMessage'),
          userInfo: userInfo
        })
      })
    }
  },
  putAdminUsersAccount: function (req, res, next) {
    var userid = req.params.idrole.split('&')[0]
    var userrole = req.params.idrole.split('&')[1]
    function stringToBoolean (value) { return (value === 'true') }
    var userAvailable = stringToBoolean(req.body.user.available)
    var userRecruit = stringToBoolean(req.body.user.recruit)
    var userHire = stringToBoolean(req.body.user.hire)
    var userActivateStatus = stringToBoolean(req.body.user.activatestatus)
    function allFieldsRequired () {
      var regexBoolean = new RegExp(/^true|false$/)
      function inputNotEmpty (param) {
        if (param.length > 0) {
          return false
        } else {
          return true
        }
      }
      if (
      inputNotEmpty(req.body.user.local.email) ||
      inputNotEmpty(req.body.user.local.identification) ||
      !regexBoolean.test(userAvailable) ||
      !regexBoolean.test(userRecruit) ||
      !regexBoolean.test(userHire) ||
      !regexBoolean.test(userActivateStatus)) {
        return true
      }
    }
    var regexEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
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
    var regexEmployerNRIC = new RegExp(/^([S,T,s,t][0-9]{7}[A-J,Z,a-j,z])$|^([F,G,f,g][0-9]{7}[K-R,T-X,k-r,t-x])$/)
    if (allFieldsRequired()) {
      req.flash('adminUserAccountMessage', 'All fields must be filled!')
      res.redirect('/admin/users/' + req.params.idrole)
    } else {
      if (regexEmail.test(req.body.user.local.email)) {
        if (userrole === 'employer') {
          if (nricvalidator(req.body.user.local.identification) && regexEmployerNRIC.test(req.body.user.local.identification)) {
            User.findOneAndUpdate({'_id': userid}, {
              'local.identification': req.body.user.local.identification.toUpperCase(),
              'recruit': userRecruit,
              'hire': userHire
            }, function (err, newUser) {
              if (err) { return next(err) }
              if (newUser.local.email !== req.body.user.local.email) {
                User.findOne({'local.email': req.body.user.local.email}, function (err, foundEmail) {
                  if (err) { return next(err) }
                  if (!foundEmail) {
                    User.findOneAndUpdate({'_id': newUser._id}, {'local.email': req.body.user.local.email}, function (err) {
                      if (err) { return next(err) }
                      res.redirect('/admin/users/' + req.params.idrole)
                    })
                  } else {
                    req.flash('adminUserAccountMessage', 'Email has been taken!')
                    res.redirect('/admin/users/' + req.params.idrole)
                  }
                })
              } else {
                res.redirect('/admin/users/' + req.params.idrole)
              }
            })
          } else {
            req.flash('adminUserAccountMessage', 'Invalid Singapore NRIC provided!')
            res.redirect('/admin/users/' + req.params.idrole)
          }
        } else {
          User.findOneAndUpdate({'_id': userid}, {
            'local.identification': req.body.user.local.identification.toUpperCase(),
            'available': userAvailable,
            'hire': userHire,
            'activate.status': userActivateStatus
          }, function (err, newUser) {
            if (err) { return next(err) }
            if (newUser.local.email !== req.body.user.local.email) {
              User.findOne({'local.email': req.body.user.local.email}, function (err, foundEmail) {
                if (err) { return next(err) }
                if (!foundEmail) {
                  User.findOneAndUpdate({'_id': newUser._id}, {'local.email': req.body.user.local.email}, function (err) {
                    if (err) { return next(err) }
                    res.redirect('/admin/users/' + req.params.idrole)
                  })
                } else {
                  req.flash('adminUserAccountMessage', 'Email has been taken!')
                  res.redirect('/admin/users/' + req.params.idrole)
                }
              })
            } else {
              res.redirect('/admin/users/' + req.params.idrole)
            }
          })
        }
      } else {
        req.flash('adminUserAccountMessage', 'Invalid Email format.')
        res.redirect('/admin/users/' + req.params.idrole)
      }
    }
  },
  getAdminUsersEdit: function (req, res, next) {
    var userid = req.params.idrole.split('&')[0]
    var userrole = req.params.idrole.split('&')[1]
    if (userrole === 'helper') {
      Helper.findOne({'userid': userid})
      .populate('userid')
      .exec(function (err, userInfo) {
        if (err) { return next(err) }
        res.render('admin/user/edit', {
          message: req.flash('adminUserEditMessage'),
          userInfo: userInfo
        })
      })
    } else if (userrole === 'employer') {
      Employer.findOne({'userid': userid})
      .populate('userid')
      .exec(function (err, userInfo) {
        if (err) { return next(err) }
        res.render('admin/user/edit', {
          message: req.flash('adminUserEditMessage'),
          userInfo: userInfo
        })
      })
    }
  },
  putAdminUsersEdit: function (req, res, next) {
    var userid = req.params.idrole.split('&')[0]
    var userrole = req.params.idrole.split('&')[1]
    var regexIntOrEmpty = new RegExp(/^(\s*|\d+)$/)
    var regexInt = new RegExp(/^\d+$/)
    var regexBoolean = new RegExp(/^true|false$/)
    function stringMaxLength (param, max) {
      if (param.length > max) {
        return false
      } else {
        return true
      }
    }
    function typeDate (param) {
      if (param && !Date.parse(param)) {
        return false
      } else {
        return true
      }
    }
    function helperRegexType () {
      if (
        !typeDate(req.body.helper.profile.dob) ||
        !regexInt.test(req.body.helper.local.contact.number) ||
        !regexInt.test(req.body.helper.profile.heightcm) ||
        !regexInt.test(req.body.helper.profile.weightkg) ||
        !regexInt.test(req.body.helper.profile.siblings) ||
        !regexInt.test(req.body.helper.profile.children) ||
        !regexIntOrEmpty.test(req.body.helper.profile.ageofyoungest) ||
        !regexIntOrEmpty.test(req.body.helper.workingexperience.first.from) ||
        !regexIntOrEmpty.test(req.body.helper.workingexperience.first.to) ||
        !regexIntOrEmpty.test(req.body.helper.workingexperience.second.from) ||
        !regexIntOrEmpty.test(req.body.helper.workingexperience.second.to) ||
        !regexIntOrEmpty.test(req.body.helper.workingexperience.third.from) ||
        !regexIntOrEmpty.test(req.body.helper.workingexperience.third.to) ||
        !regexBoolean.test(req.body.helper.skills.english) ||
        !regexBoolean.test(req.body.helper.skills.singapore) ||
        !regexBoolean.test(req.body.helper.skills.infantcare) ||
        !regexBoolean.test(req.body.helper.skills.childcare) ||
        !regexBoolean.test(req.body.helper.skills.elderlycare) ||
        !regexBoolean.test(req.body.helper.skills.disabledcare) ||
        !regexBoolean.test(req.body.helper.skills.housework) ||
        !regexBoolean.test(req.body.helper.skills.cooking) ||
        !regexBoolean.test(req.body.helper.skills.handledog) ||
        !regexBoolean.test(req.body.helper.skills.handlecat)) {
        return true
      }
    }
    function helperStringLength () {
      if (
        !stringMaxLength(req.body.helper.profile.firstname, 20) ||
        !stringMaxLength(req.body.helper.profile.middlename, 20) ||
        !stringMaxLength(req.body.helper.profile.familyname, 20) ||
        !stringMaxLength(req.body.helper.profile.pob, 100) ||
        !stringMaxLength(req.body.helper.profile.residentialaddress, 100) ||
        !stringMaxLength(req.body.helper.profile.portrepatriated, 50) ||
        !stringMaxLength(req.body.helper.profile.religion, 10) ||
        !stringMaxLength(req.body.helper.profile.dietaryrestriction, 20) ||
        !stringMaxLength(req.body.helper.profile.foodhandlingrestriction, 20) ||
        !stringMaxLength(req.body.helper.profile.allergies, 50) ||
        !stringMaxLength(req.body.helper.profile.maritalstatus, 10) ||
        !stringMaxLength(req.body.helper.education.educationlevel, 20) ||
        !stringMaxLength(req.body.helper.education.fieldofstudy, 50) ||
        !stringMaxLength(req.body.helper.education.otherqualifications, 300) ||
        !stringMaxLength(req.body.helper.workingexperience.first.country, 50) ||
        !stringMaxLength(req.body.helper.workingexperience.first.duties, 300) ||
        !stringMaxLength(req.body.helper.workingexperience.second.country, 50) ||
        !stringMaxLength(req.body.helper.workingexperience.second.duties, 300) ||
        !stringMaxLength(req.body.helper.workingexperience.third.country, 50) ||
        !stringMaxLength(req.body.helper.workingexperience.third.duties, 300)) {
        return true
      }
    }
    function employerRegexType () {
      if (
        !regexInt.test(req.body.employer.local.contact.number) ||
        !regexIntOrEmpty.test(req.body.employer.profile.postalcode) ||
        !regexInt.test(req.body.employer.household.adult) ||
        !regexInt.test(req.body.employer.household.teenager) ||
        !regexInt.test(req.body.employer.household.children) ||
        !regexInt.test(req.body.employer.household.infant) ||
        !regexInt.test(req.body.employer.household.elderly) ||
        !regexInt.test(req.body.employer.household.disabled) ||
        !regexBoolean.test(req.body.employer.jobscope.infantcare) ||
        !regexBoolean.test(req.body.employer.jobscope.childcare) ||
        !regexBoolean.test(req.body.employer.jobscope.elderlycare) ||
        !regexBoolean.test(req.body.employer.jobscope.disabledcare) ||
        !regexBoolean.test(req.body.employer.jobscope.housework) ||
        !regexBoolean.test(req.body.employer.jobscope.cooking) ||
        !regexBoolean.test(req.body.employer.jobscope.handledog) ||
        !regexBoolean.test(req.body.employer.jobscope.handlecat)) {
        return true
      }
    }
    function employerStringLength () {
      if (
        !stringMaxLength(req.body.employer.profile.fullname, 50) ||
        !stringMaxLength(req.body.employer.profile.blockhouseno, 20) ||
        !stringMaxLength(req.body.employer.profile.unitno, 20) ||
        !stringMaxLength(req.body.employer.profile.streetname, 50) ||
        !stringMaxLength(req.body.employer.jobscope.otherduties, 300)) {
        return true
      }
    }
    if (userrole === 'helper') {
      if (helperRegexType()) {
        req.flash('adminUserEditMessage', 'Error! Wrong format provided.')
        res.redirect('/admin/users/' + req.params.idrole + '/edit')
      } else if (helperStringLength()) {
        req.flash('adminUserEditMessage', 'Error! Exceeded character limit.')
        res.redirect('/admin/users/' + req.params.idrole + '/edit')
      } else {
        Helper.findOneAndUpdate({'userid': userid}, {
          'profile.firstname': req.body.helper.profile.firstname,
          'profile.middlename': req.body.helper.profile.middlename,
          'profile.familyname': req.body.helper.profile.familyname,
          'profile.dob': req.body.helper.profile.dob,
          'profile.pob': req.body.helper.profile.pob,
          'profile.nationality': req.body.helper.profile.nationality,
          'profile.residentialaddress': req.body.helper.profile.residentialaddress,
          'profile.portrepatriated': req.body.helper.profile.portrepatriated,
          'profile.religion': req.body.helper.profile.religion,
          'profile.dietaryrestriction': req.body.helper.profile.dietaryrestriction,
          'profile.foodhandlingrestriction': req.body.helper.profile.foodhandlingrestriction,
          'profile.allergies': req.body.helper.profile.allergies,
          'profile.heightcm': req.body.helper.profile.heightcm,
          'profile.weightkg': req.body.helper.profile.weightkg,
          'profile.siblings': req.body.helper.profile.siblings,
          'profile.maritalstatus': req.body.helper.profile.maritalstatus,
          'profile.children': req.body.helper.profile.children,
          'profile.ageofyoungest': req.body.helper.profile.ageofyoungest,
          'education.educationlevel': req.body.helper.education.educationlevel,
          'education.fieldofstudy': req.body.helper.education.fieldofstudy,
          'education.otherqualifications': req.body.helper.education.otherqualifications,
          'skills.english': req.body.helper.skills.english,
          'skills.singapore': req.body.helper.skills.singapore,
          'skills.infantcare': req.body.helper.skills.infantcare,
          'skills.childcare': req.body.helper.skills.childcare,
          'skills.elderlycare': req.body.helper.skills.elderlycare,
          'skills.disabledcare': req.body.helper.skills.disabledcare,
          'skills.housework': req.body.helper.skills.housework,
          'skills.cooking': req.body.helper.skills.cooking,
          'skills.handledog': req.body.helper.skills.handledog,
          'skills.handlecat': req.body.helper.skills.handlecat,
          'workingexperience.first.from': req.body.helper.workingexperience.first.from,
          'workingexperience.first.to': req.body.helper.workingexperience.first.to,
          'workingexperience.first.country': req.body.helper.workingexperience.first.country,
          'workingexperience.first.duties': req.body.helper.workingexperience.first.duties,
          'workingexperience.second.from': req.body.helper.workingexperience.second.from,
          'workingexperience.second.to': req.body.helper.workingexperience.second.to,
          'workingexperience.second.country': req.body.helper.workingexperience.second.country,
          'workingexperience.second.duties': req.body.helper.workingexperience.second.duties,
          'workingexperience.third.from': req.body.helper.workingexperience.third.from,
          'workingexperience.third.to': req.body.helper.workingexperience.third.to,
          'workingexperience.third.country': req.body.helper.workingexperience.third.country,
          'workingexperience.third.duties': req.body.helper.workingexperience.third.duties
        }, function (err, helperInfo) {
          if (err) { return next(err) }
          helperInfo.searchString(req.body.helper, function (err, response) {
            if (err) { return next(err) }
            User.findOneAndUpdate({'_id': userid}, {
              'local.contact.countrycode': req.body.helper.local.contact.countrycode,
              'local.contact.number': req.body.helper.local.contact.number
            }, function (err) {
              if (err) { return next(err) }
              res.redirect('/admin/users/' + req.params.idrole + '/edit')
            })
          })
        })
      }
    }
    if (userrole === 'employer') {
      if (employerRegexType()) {
        req.flash('adminUserEditMessage', 'Error! Wrong format provided.')
        res.redirect('/admin/users/' + req.params.idrole + '/edit')
      } else if (employerStringLength()) {
        req.flash('adminUserEditMessage', 'Error! Exceeded character limit.')
        res.redirect('/admin/users/' + req.params.idrole + '/edit')
      } else {
        Employer.findOneAndUpdate({'userid': userid}, {
          'profile.fullname': req.body.employer.profile.fullname,
          'profile.housetype': req.body.employer.profile.housetype,
          'profile.blockhouseno': req.body.employer.profile.blockhouseno,
          'profile.unitno': req.body.employer.profile.unitno,
          'profile.streetname': req.body.employer.profile.streetname,
          'profile.postalcode': req.body.employer.profile.postalcode,
          'profile.maritalstatus': req.body.employer.profile.maritalstatus,
          'household.adult': req.body.employer.household.adult,
          'household.teenager': req.body.employer.household.teenager,
          'household.children': req.body.employer.household.children,
          'household.infant': req.body.employer.household.infant,
          'household.elderly': req.body.employer.household.elderly,
          'household.disabled': req.body.employer.household.disabled,
          'jobscope.infantcare': req.body.employer.jobscope.infantcare,
          'jobscope.childcare': req.body.employer.jobscope.childcare,
          'jobscope.elderlycare': req.body.employer.jobscope.elderlycare,
          'jobscope.disabledcare': req.body.employer.jobscope.disabledcare,
          'jobscope.housework': req.body.employer.jobscope.housework,
          'jobscope.cooking': req.body.employer.jobscope.cooking,
          'jobscope.handledog': req.body.employer.jobscope.handledog,
          'jobscope.handlecat': req.body.employer.jobscope.handlecat,
          'jobscope.otherduties': req.body.employer.jobscope.otherduties
        }, function (err) {
          if (err) { return next(err) }
          User.findOneAndUpdate({'_id': userid}, {'local.contact.countrycode': '+65', 'local.contact.number': req.body.employer.local.contact.number}, function (err) {
            if (err) { return next(err) }
            res.redirect('/admin/users/' + req.params.idrole + '/edit')
          })
        })
      }
    }
  },
  getAdminUsersHire: function (req, res, next) {
    var userid = req.params.idrole.split('&')[0]
    var userrole = req.params.idrole.split('&')[1]
    if (userrole === 'employer') {
      Hire.find({'euserid': userid})
      .sort({'_id': -1})
      .exec(function (err, hireArray) {
        if (err) { return next(err) }
        var idArray = []
        hireArray.forEach(function (hire) { idArray.push(hire.huserid) })
        Helper.find({'userid': {$in: idArray}})
        .populate('userid')
        .exec(function (err, userArray) {
          if (err) { return next(err) }
          var hireInfo = []
          for (var i = 0; i < hireArray.length; i++) {
            for (var j = 0; j < userArray.length; j++) {
              if (hireArray[i].huserid.toString() === userArray[j].userid._id.toString()) {
                var obj = {
                  _id: hireArray[i]._id,
                  huserid: hireArray[i].huserid,
                  euserid: hireArray[i].euserid,
                  status: hireArray[i].status,
                  message: hireArray[i].message,
                  user: userArray[j]
                }
              }
            }
            hireInfo.push(obj)
          }
          Employer.findOne({'userid': userid})
          .populate('userid')
          .exec(function (err, userInfo) {
            if (err) { return next(err) }
            res.render('admin/user/hire', {
              userInfo: userInfo,
              hireInfo: hireInfo
            })
          })
        })
      })
    } else {
      Hire.find({'huserid': userid})
      .sort({'_id': -1})
      .exec(function (err, hireArray) {
        if (err) { return next(err) }
        var idArray = []
        hireArray.forEach(function (hire) { idArray.push(hire.euserid) })
        Employer.find({'userid': {$in: idArray}})
        .populate('userid')
        .exec(function (err, userArray) {
          if (err) { return next(err) }
          var hireInfo = []
          for (var i = 0; i < hireArray.length; i++) {
            for (var j = 0; j < userArray.length; j++) {
              if (hireArray[i].euserid.toString() === userArray[j].userid._id.toString()) {
                var obj = {
                  _id: hireArray[i]._id,
                  huserid: hireArray[i].huserid,
                  euserid: hireArray[i].euserid,
                  status: hireArray[i].status,
                  message: hireArray[i].message,
                  user: userArray[j]
                }
              }
            }
            hireInfo.push(obj)
          }
          Helper.findOne({'userid': userid})
          .populate('userid')
          .exec(function (err, userInfo) {
            if (err) { return next(err) }
            res.render('admin/user/hire', {
              userInfo: userInfo,
              hireInfo: hireInfo
            })
          })
        })
      })
    }
  },
  getAdminAllHire: function (req, res, next) {
    var status = []
    if (req.params.status === 'all') {
      status = ['pending', 'rejected', 'accepted', 'confirmed', 'completed']
    } else {
      status = [req.params.status]
    }
    Hire.find({'status': {$in: status}})
    .populate('euserid')
    .populate('huserid')
    .sort({'_id': -1})
    .exec(function (err, hireArray) {
      if (err) { return next(err) }
      if (hireArray.length > 0) {
        res.render('admin/hires/index', {
          hireArray: hireArray
        })
      } else {
        req.flash('adminMessage', 'Could not find any shortlists with status \'' + req.params.status + '\'.')
        res.redirect('/admin')
      }
    })
  },
  getAdminHire: function (req, res, next) {
    Hire.find({'_id': req.params.id})
    .populate('euserid')
    .populate('huserid')
    .sort({'_id': -1})
    .exec(function (err, hireArray) {
      if (!hireArray || err) {
        req.flash('adminMessage', 'Could not find any shortlists with id \'' + req.params.id + '\'.')
        return next(res.redirect('/admin'))
      }
      if (hireArray.length > 0) {
        res.render('admin/hires/index', {
          hireArray: hireArray
        })
      } else {
        req.flash('adminMessage', 'Could not find any shortlists with id \'' + req.params.id + '\'.')
        res.redirect('/admin')
      }
    })
  },
  postAJAXAdminHire: function (req, res, next) {
    Hire.findOneAndUpdate({'_id': req.params.id}, {'status': req.body.status}, function (err, hireInfo) {
      if (!hireInfo || err) { return next(err) }
      res.send({ status: 'success' })
    })
  },
  getAdminInactiveHelpers: function (req, res, next) {
    var threeweeks = new Date(new Date().setDate(new Date().getDate() - 21))
    var onemonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
    // threeweeks is Mar 06, onemonth is Feb 27, 26 Feb cannot, 28 Feb can
    Helper.find({'lastactive': {$lt: threeweeks, $gte: onemonth}})
    .populate('userid')
    .sort({'lastactive': -1})
    .exec(function (err, helperArray) {
      if (!helperArray || err) { return next(err) }
      if (helperArray.length > 0) {
        res.render('admin/inactive/helper', {
          helperArray: helperArray
        })
      } else {
        req.flash('adminMessage', 'Could not find any inactive helpers!')
        res.redirect('/admin')
      }
    })
  },
  postAJAXAdminInactiveHelpersAll: function (req, res, next) {
    var threeweeks = new Date(new Date().setDate(new Date().getDate() - 21))
    var onemonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
    // threeweeks is Mar 06, onemonth is Feb 27, 26 Feb cannot, 28 Feb can
    Helper.find({'lastactive': {$lt: threeweeks, $gte: onemonth}})
    .populate('userid')
    .exec(function (err, helperArray) {
      if (!helperArray || err) { return next(err) }
      if (helperArray.length > 0) {
        helperArray.forEach(function (helper) {
          var newMail = new Mail({
            from: 'support@maidicare.com',
            to: [{email: helper.userid.local.email}],
            subject: 'MaidiCare Account Expiry',
            message: 'WHAT NOW?',
            substitutions: {
              '-useremail-': helper.userid.local.email,
              '-type-': 'Account Expiry',
              '-instructions-': 'Your account is going to expire as you have not been using it. This means potential employers will NOT be able to hire you.',
              '-action-': 'To prevent your account from expiring, please login to your account at:',
              '-href-': 'http://maidicare.com/login'
            },
            templateid: 'cd40cf81-91bb-40db-8229-cbde1d35cf2e'
          })
          newMail.sendEmail(newMail, function (err, response) {
            if (err) { return next(err) }
          })
        })
        res.send({
          status: 'success',
          message: 'The warning mail was sent successfully to all.'
        })
      } else {
        res.send({
          status: 'error',
          message: 'Could not find any inactive helpers!'
        })
      }
    })
  },
  postAJAXAdminInactiveHelpersIndiv: function (req, res, next) {
    User.findOne({'_id': req.params.id}, function (err, userInfo) {
      if (err) { return next(err) }
      var newMail = new Mail({
        from: 'support@maidicare.com',
        to: [{email: userInfo.local.email}],
        subject: 'MaidiCare Account Expiry',
        message: 'WHAT NOW?',
        substitutions: {
          '-useremail-': userInfo.local.email,
          '-type-': 'Account Expiry',
          '-instructions-': 'Your account is going to expire as you have not been using it. This means potential employers will NOT be able to hire you.',
          '-action-': 'To prevent your account from expiring, please login to your account at:',
          '-href-': 'http://maidicare.com/login'
        },
        templateid: 'cd40cf81-91bb-40db-8229-cbde1d35cf2e'
      })
      newMail.sendEmail(newMail, function (err, response) {
        if (err) {
          res.send({
            status: 'error',
            message: 'Please refresh the page and try again. You can also contact us at \'support@maidicare.com\'.'
          })
        }
        res.send({
          status: 'success',
          message: 'The warning mail was sent successfully to ' + userInfo.local.email
        })
      })
    })
  },
  getAdminInactiveHire: function (req, res, next) {
    var oneweek = new Date(new Date().setDate(new Date().getDate() - 7))
    // oneweek is 20 Feb, 19 Feb cannot, 22 Feb can
    Hire.find({'lastactive': {$lte: oneweek}})
    .populate('euserid')
    .populate('huserid')
    .sort({'lastactive': -1})
    .exec(function (err, hireArray) {
      if (!hireArray || err) {
        req.flash('adminMessage', 'Could not find any inactive shortlists!')
        return next(res.redirect('/admin'))
      }
      if (hireArray.length > 0) {
        res.render('admin/inactive/hire', {
          hireArray: hireArray
        })
      } else {
        req.flash('adminMessage', 'Could not find any inactive shortlists!')
        res.redirect('/admin')
      }
    })
  },
  postAJAXAdminInactiveHire: function (req, res, next) {
    var euserid = req.body.userids.split('&')[0]
    var huserid = req.body.userids.split('&')[1]
    var useridArray = [euserid, huserid]
    User.find({'_id': {$in: useridArray}}, function (err, userArray) {
      if (err) { return next(err) }
      userArray.forEach(function (user) {
        var newMail = new Mail({
          from: 'support@maidicare.com',
          to: [{email: user.local.email}],
          subject: 'MaidiCare Shortlist Reminder',
          message: 'What can I do?',
          substitutions: {
            '-useremail-': user.local.email,
            '-type-': 'Shortlist Reminder',
            '-instructions-': 'You have an inactive shortlist that requires your attention.',
            '-action-': 'If the other party is unresponsive, please contact us directly at:',
            '-href-': 'support@maidicare.com'
          },
          templateid: 'cd40cf81-91bb-40db-8229-cbde1d35cf2e'
        })
        newMail.sendEmail(newMail, function (err, response) {
          if (err) { return next(err) }
        })
      })
      res.send({
        status: 'success',
        message: 'The warning mail was sent successfully to both ' + userArray[0].local.email + ' & ' + userArray[1].local.email + '.'
      })
    })
  }
}
