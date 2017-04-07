var User = require('../models/user')
var Helper = require('../models/helper')
var Employer = require('../models/employer')
var Hire = require('../models/hire')
var Mail = require('../models/mail')
var cloudinary = require('cloudinary')
var fs = require('fs')
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

// export functions to user route
module.exports = {
  getProfile: function (req, res) {
    res.redirect('/users/' + req.user.id)
  },
  getEdit: function (req, res) {
    res.redirect('/users/' + req.user.id + '/edit')
  },
  getHire: function (req, res) {
    res.redirect('/users/' + req.user.id + '/shortlists')
  },
  getActivate: function (req, res) {
    res.redirect('/users/' + req.user.id + '/activate')
  },
  postAJAXEmailTaken: function (req, res, next) {
    User.findOne({'local.email': req.body.email}, function (err, emailFound) {
      if (err) { return next(err) }
      if (!emailFound) {
        res.send({status: 'success'})
      } else {
        res.send({status: 'error'})
      }
    })
  },
  postPersonalPhoto: function (req, res, next) {
    function removeupload (originalname, type, error) {
      var messagetype = ''
      var redirecttype = ''
      if (type === 'login') {
        messagetype = 'loginMessage'
        redirecttype = '/login'
      } else {
        messagetype = 'userMessage'
        redirecttype = '/users'
      }
      if (fs.existsSync('./uploads/' + originalname)) {
        fs.unlink('./uploads/' + originalname, (err) => {
          if (err) { return next(err) }
          req.flash(messagetype, error)
          res.redirect(redirecttype)
        })
      } else {
        req.flash(messagetype, error)
        res.redirect(redirecttype)
      }
    }
    if (req.user) {
      if (req.file) {
        if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png') {
          if (req.file.size < 7000000) {
            Helper.findOne({'userid': req.user.id}, function (err, helperInfo) {
              if (err) { return next(err) }
              cloudinary.uploader.destroy(helperInfo._id, function (destroy) { })
              cloudinary.uploader.upload(req.file.path, function (result) {
                // res.send(result)
                cloudinary.uploader.rename(result.public_id, helperInfo._id, function (renamed) {
                  Helper.findOneAndUpdate({'_id': helperInfo._id}, {
                    'profile.photo.version': result.version,
                    'profile.photo.format': result.format,
                    'profile.photo.exists': true
                  }, function (err) {
                    if (err) { return next(err) }
                    if (fs.existsSync('./uploads/' + req.file.originalname)) {
                      fs.unlink('./uploads/' + req.file.originalname, (err) => {
                        if (err) { return next(err) }
                        res.redirect('/users')
                      })
                    } else {
                      res.redirect('/users')
                    }
                  })
                })
              })
            })
          } else {
            removeupload(req.file.originalname, 'users', 'Image size too big. Please provide an image below 7 MB.')
          }
        } else {
          removeupload(req.file.originalname, 'users', 'Wrong image format. Please provide the following formats, PNG, JPG or JPEG.')
        }
      } else {
        removeupload(req.file.originalname, 'users', 'Oops. Something went wrong with the upload. Please refresh the page again.')
      }
    } else {
      removeupload(req.file.originalname, 'login', 'Your session has timed out. Please login again.')
    }
  },
  getEmployerView: function (req, res, next) {
    if (req.user.local.role === 'helper') {
      Hire.findOne({'euserid': req.params.id, 'huserid': req.user.id, 'status': {$nin: ['rejected', 'completed']}}, function (err, isHired) {
        if (err) { return next(err) }
        if (isHired) {
          Employer.findOne({'userid': req.params.id}, function (err, employerInfo) {
            if (err) { return next(err) }
            res.render('user/employer', {
              employerInfo: employerInfo
            })
          })
        } else {
          req.flash('hireMessage', 'Sorry, but you do not have access to this page.')
          res.redirect('/users/shortlists')
        }
      })
    } else {
      req.flash('hireMessage', 'Sorry, but you do not have access to this page.')
      res.redirect('/users/shortlists')
    }
  },
  getPersonal: function (req, res, next) {
    if (req.user.local.role === 'employer') {
      Employer.findOne({'userid': req.user.id}, function (err, userInfo) {
        if (err) { return next(err) }
        res.render('user/index', {
          message: req.flash('userMessage'),
          userInfo: userInfo
        })
      })
    } else {
      Helper.findOneAndUpdate({'userid': req.user.id}, {'lastactive': new Date()}, function (err, userInfo) {
        if (err) { return next(err) }
        res.render('user/index', {
          message: req.flash('userMessage'),
          userInfo: userInfo
        })
      })
    }
  },
  getPersonalEdit: function (req, res, next) {
    if (req.user.local.role === 'employer') {
      Employer.findOne({'userid': req.user.id}, function (err, userInfo) {
        if (err) { return next(err) }
        res.render('user/edit', {
          message: req.flash('editMessage'),
          userInfo: userInfo
        })
      })
    } else {
      Helper.findOne({'userid': req.user.id}, function (err, userInfo) {
        if (err) { return next(err) }
        res.render('user/edit', {
          message: req.flash('editMessage'),
          userInfo: userInfo
        })
      })
    }
  },
  putPersonalEdit: function (req, res, next) {
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
    function inputNotEmpty (param) {
      if (param.length > 0) {
        return false
      } else {
        return true
      }
    }
    function numberNotZero (param) {
      if (param > 0) {
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
    function helperNotEmpty () {
      if (
        inputNotEmpty(req.body.helper.profile.firstname) ||
        inputNotEmpty(req.body.helper.profile.familyname) ||
        inputNotEmpty(req.body.helper.profile.dob) ||
        inputNotEmpty(req.body.helper.profile.pob) ||
        inputNotEmpty(req.body.helper.profile.nationality) ||
        inputNotEmpty(req.body.helper.local.contact.countrycode) ||
        inputNotEmpty(req.body.helper.profile.residentialaddress) ||
        inputNotEmpty(req.body.helper.profile.portrepatriated) ||
        inputNotEmpty(req.body.helper.profile.religion) ||
        inputNotEmpty(req.body.helper.profile.dietaryrestriction) ||
        inputNotEmpty(req.body.helper.profile.foodhandlingrestriction) ||
        inputNotEmpty(req.body.helper.profile.maritalstatus) ||
        inputNotEmpty(req.body.helper.education.educationlevel) ||
        inputNotEmpty(req.body.helper.education.fieldofstudy) ||
        numberNotZero(req.body.helper.local.contact.number) ||
        numberNotZero(req.body.helper.profile.heightcm) ||
        numberNotZero(req.body.helper.profile.weightkg)) {
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
    function employerNotEmpty () {
      if (
        inputNotEmpty(req.body.employer.profile.fullname) ||
        inputNotEmpty(req.body.employer.profile.housetype) ||
        inputNotEmpty(req.body.employer.profile.blockhouseno) ||
        inputNotEmpty(req.body.employer.profile.unitno) ||
        inputNotEmpty(req.body.employer.profile.streetname) ||
        inputNotEmpty(req.body.employer.profile.maritalstatus) ||
        numberNotZero(req.body.employer.profile.postalcode) ||
        numberNotZero(req.body.employer.local.contact.number)) {
        return true
      }
    }
    if (req.user.local.role === 'helper') {
      if (!req.user.available) {
        if (helperRegexType()) {
          req.flash('editMessage', 'Error! Wrong format provided.')
          res.redirect('/users/edit/')
        } else if (helperStringLength()) {
          req.flash('editMessage', 'Error! Exceeded character limit.')
          res.redirect('/users/edit/')
        } else {
          Helper.findOneAndUpdate({'userid': req.user.id}, {
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
              User.findOneAndUpdate({'_id': req.user.id}, {'local.contact.countrycode': req.body.helper.local.contact.countrycode, 'local.contact.number': req.body.helper.local.contact.number}, function (err) {
                if (err) { return next(err) }
                if (req.body.helper.saveOrSubmit === 'save') {
                  req.flash('editMessage', 'Save Successful! To complete your profile, please click the green \'Submit\' button.')
                  res.redirect('/users/edit/')
                } else {
                  if (helperNotEmpty()) {
                    req.flash('editMessage', 'Please fill in all required \'*\' fields.')
                    res.redirect('/users/edit/')
                  } else {
                    User.findOneAndUpdate({'_id': req.user.id}, {
                      'available': true
                    }, function (err) {
                      if (err) { return next(err) }
                      res.redirect('/users')
                    })
                  }
                }
              })
            })
          })
        }
      } else {
        if (helperRegexType()) {
          req.flash('editMessage', 'Error! Wrong format provided.')
          res.redirect('/users/edit/')
        } else if (helperStringLength()) {
          req.flash('editMessage', 'Error! Exceeded character limit.')
          res.redirect('/users/edit/')
        } else if (helperNotEmpty()) {
          req.flash('editMessage', 'Please fill in all required \'*\' fields.')
          res.redirect('/users/edit/')
        } else {
          Helper.findOneAndUpdate({'userid': req.user.id}, {
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
              User.findOneAndUpdate({'_id': req.user.id}, {'local.contact.countrycode': req.body.helper.local.contact.countrycode, 'local.contact.number': req.body.helper.local.contact.number}, function (err) {
                if (err) { return next(err) }
                res.redirect('/users/edit')
              })
            })
          })
        }
      }
    }
    if (req.user.local.role === 'employer') {
      if (!req.user.recruit) {
        if (employerRegexType()) {
          req.flash('editMessage', 'Error! Wrong format provided.')
          res.redirect('/users/edit/')
        } else if (employerStringLength()) {
          req.flash('editMessage', 'Error! Exceeded character limit.')
          res.redirect('/users/edit/')
        } else {
          Employer.findOneAndUpdate({'userid': req.user.id}, {
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
            User.findOneAndUpdate({'_id': req.user.id}, {'local.contact.countrycode': '+65', 'local.contact.number': req.body.employer.local.contact.number}, function (err) {
              if (err) { return next(err) }
              if (req.body.employer.saveOrSubmit === 'save') {
                req.flash('editMessage', 'Save Successful! To complete your profile, please click the green \'Submit\' button.')
                res.redirect('/users/edit/')
              } else {
                if (employerNotEmpty()) {
                  req.flash('editMessage', 'Please fill in all required \'*\' fields.')
                  res.redirect('/users/edit/')
                } else {
                  User.findOneAndUpdate({'_id': req.user.id}, {
                    'recruit': true
                  }, function (err) {
                    if (err) { return next(err) }
                    res.redirect('/users')
                  })
                }
              }
            })
          })
        }
      } else {
        if (employerRegexType()) {
          req.flash('editMessage', 'Error! Wrong format provided.')
          res.redirect('/users/edit/')
        } else if (employerStringLength()) {
          req.flash('editMessage', 'Error! Exceeded character limit.')
          res.redirect('/users/edit/')
        } else if (employerNotEmpty()) {
          req.flash('editMessage', 'Please fill in all required \'*\' fields.')
          res.redirect('/users/edit/')
        } else {
          Employer.findOneAndUpdate({'userid': req.user.id}, {
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
            User.findOneAndUpdate({'_id': req.user.id}, {'local.contact.countrycode': '+65', 'local.contact.number': req.body.employer.local.contact.number}, function (err) {
              if (err) { return next(err) }
              res.redirect('/users/edit/')
            })
          })
        }
      }
    }
  },
  getPersonalActivate: function (req, res) {
    res.render('user/activate/index', {
      message: req.flash('activateMessage')
    })
  },
  postPersonalActivate: function (req, res, next) {
    var code = req.body.code
    User.findOne({'_id': req.user.id}, function (err, userInfo) {
      if (err) { return next(err) }
      userInfo.activateauth(code, function (err, codeCorrect) {
        if (err) { return next(err) }
        if (codeCorrect) {
          User.findOneAndUpdate({'_id': req.user.id}, {'activate.status': true}, function (err) {
            if (err) { return next(err) }
            res.redirect('/users/' + req.user.id + '/activate/success')
          })
        } else {
          req.flash('activateMessage', 'Invalid Activation Code. Please try again.')
          res.redirect('/users/' + req.user.id + '/activate')
        }
      })
    })
  },
  postAJAXPersonalActivateReset: function (req, res, next) {
    if (req.user) {
      if (!req.user.activate.status && req.user.local.role === 'helper') {
        var codestring = generateCode(1).substring(0, 10)
        bcrypt.genSalt(5, function (err, salt) {
          if (err) { return next(err) }
          bcrypt.hash(codestring, salt, function (err, hash) {
            if (err) { return next(err) }
            User.findOneAndUpdate({'_id': req.user.id}, {'activate.code': hash}, function (err, userInfo) {
              if (err) { return next(err) }
              var newMail = new Mail({
                from: 'support@maidicare.com',
                to: [{email: userInfo.local.email}],
                subject: 'MaidiCare Activate Account',
                message: codestring,
                substitutions: {
                  '-useremail-': userInfo.local.email,
                  '-type-': 'Activate Account',
                  '-instructions-': 'Your activation code is:',
                  '-action-': 'Click the button or copy the link below to activate,',
                  '-href-': 'http://maidicare.com/users/' + userInfo._id + '/activate/' + codestring
                },
                templateid: 'cd40cf81-91bb-40db-8229-cbde1d35cf2e'
              })
              newMail.sendEmail(newMail, function (err, response) {
                if (err) { return next(err) }
                res.send({
                  status: 'success',
                  message: 'Your new activation code has been sent to your email.'
                })
              })
            })
          })
        })
      } else {
        res.send({
          status: 'error',
          message: 'Your account has already been activated.'
        })
      }
    } else {
      res.send({
        status: 'error',
        message: 'Your session has timed out. Please login again.'
      })
    }
  },
  getPersonalActivateSuccess: function (req, res) {
    res.render('user/activate/success')
  },
  getPersonalActivateUrl: function (req, res, next) {
    var code = req.params.code
    User.findOne({'_id': req.user.id}, function (err, userInfo) {
      if (err) { return next(err) }
      userInfo.activateauth(code, function (err, codeCorrect) {
        if (err) { return next(err) }
        if (codeCorrect) {
          User.findOneAndUpdate({'_id': req.user.id}, {'activate.status': true}, function (err) {
            if (err) { return next(err) }
            res.redirect('/users/' + req.user.id + '/activate/success')
          })
        } else {
          req.flash('activateMessage', 'Invalid code entered. The account could not be activated.')
          res.redirect('/users/' + req.user.id + '/activate')
        }
      })
    })
  },
  getPersonalHire: function (req, res, next) {
    if (req.user.local.role === 'employer') {
      Hire.find({'euserid': req.user.id})
      .sort({'_id': -1})
      .exec(function (err, hireArray) {
        if (err) { return next(err) }
        var idArray = []
        hireArray.forEach(function (hire) {
          idArray.push(hire.huserid)
        })
        Helper.find({'userid': {$in: idArray}}, function (err, userArray) {
          if (err) { return next(err) }
          var hireInfo = []
          // first loop to push x times
          // second loop to find the user
          for (var i = 0; i < hireArray.length; i++) {
            for (var j = 0; j < userArray.length; j++) {
              if (hireArray[i].huserid.toString() === userArray[j].userid.toString()) {
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
          Employer.findOne({'userid': req.user.id}, function (err, userInfo) {
            if (err) { return next(err) }
            res.render('user/hire', {
              message: req.flash('hireMessage'),
              userInfo: userInfo,
              hireInfo: hireInfo
            })
          })
        })
      })
    } else {
      Hire.find({'huserid': req.user.id})
      .sort({'_id': -1})
      .exec(function (err, hireArray) {
        if (err) { return next(err) }
        var idArray = []
        hireArray.forEach(function (hire) {
          idArray.push(hire.euserid)
        })
        Employer.find({'userid': {$in: idArray}}, function (err, userArray) {
          if (err) { return next(err) }
          var hireInfo = []
          // first loop to push x times
          // second loop to find the user
          for (var i = 0; i < hireArray.length; i++) {
            for (var j = 0; j < userArray.length; j++) {
              if (hireArray[i].euserid.toString() === userArray[j].userid.toString()) {
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
          Helper.findOne({'userid': req.user.id}, function (err, userInfo) {
            if (err) { return next(err) }
            res.render('user/hire', {
              message: req.flash('hireMessage'),
              userInfo: userInfo,
              hireInfo: hireInfo
            })
          })
        })
      })
    }
  },
  postAJAXPersonalHire: function (req, res, next) {
    if (req.user) {
      if (req.body.status === 'Accept' && req.user.local.role === 'helper') {
        Hire.findOne({'huserid': req.user.id, 'status': {$in: ['accepted', 'confirmed']}}, function (err, isHired) {
          if (err) { return next(err) }
          if (!isHired) {
            Hire.findOneAndUpdate({'_id': req.body.hireid, 'huserid': req.user.id}, {
              'lastactive': new Date(),
              'status': req.body.status.toLowerCase() + 'ed',
              'message': 'Helper accepted the hire request. Awaiting Employer Confirmation.'
            })
            .populate('euserid')
            .populate('huserid')
            .exec(function (err, hiredata) {
              if (err) { return next(err) }
              var newMail = new Mail({
                from: 'support@maidicare.com',
                to: [{email: hiredata.euserid.local.email}],
                subject: 'MaidiCare Shortlist Update',
                message: 'A helper has ACCEPTED your hire request and is waiting for your confirmation.',
                substitutions: {
                  '-name-': hiredata.euserid.local.email,
                  '-instructions-': 'Click the button or copy the link below to respond,',
                  '-buttontext-': 'View Shortlists',
                  '-href-': 'http://maidicare.com/users/shortlists'
                },
                templateid: '6a0bf52e-9db6-42db-abb6-392169497e50'
              })
              newMail.sendEmail(newMail, function (err, response) {
                if (err) { return next(err) }
                res.send({status: 'success'})
              })
            })
          } else {
            res.send({
              status: 'error',
              message: 'Cannot \'' + req.body.status + '\' more than one employer.'
            })
          }
        })
      } else if (req.body.status === 'Confirm' && req.user.local.role === 'employer') {
        if (req.user.hire) {
          Hire.findOneAndUpdate({'_id': req.body.hireid, 'euserid': req.user.id}, {
            'lastactive': new Date(),
            'status': req.body.status.toLowerCase() + 'ed',
            'message': 'Employer confirmed the hire request. Please check your email for further instructions.'
          })
          .populate('euserid')
          .populate('huserid')
          .exec(function (err, hiredata) {
            if (err) { return next(err) }
            Hire.update({
              '_id': {$ne: req.body.hireid},
              'huserid': hiredata.huserid,
              'status': {$in: ['pending', 'accepted']}
            }, {
              'status': 'rejected',
              'message': 'Helper has been hired by another employer. Hire unsuccessful.'
            }, {'multi': true}, function (err) {
              if (err) { return next(err) }
              Hire.update({
                '_id': {$ne: req.body.hireid},
                'euserid': hiredata.euserid,
                'status': {$in: ['pending', 'accepted']}
              }, {
                'status': 'rejected',
                'message': 'Employer hired another helper. Hire unsuccessful.'
              }, {'multi': true}, function (err) {
                if (err) { return next(err) }
                User.update({'_id': {$in: [hiredata.huserid, hiredata.euserid]}}, {'hire': false}, {'multi': true}, function (err) {
                  if (err) { return next(err) }
                  var newMail = new Mail({
                    from: 'support@maidicare.com',
                    to: [{email: hiredata.euserid.local.email}],
                    bcc: [{email: 'support@maidicare.com'},
                    {email: 'alexwongweilun@gmail.com'}],
                    subject: 'MaidiCare Shortlist Update',
                    message: 'Congratulations! Your hire request is successful. Our administrative team will be in touch with you shortly. HireID: ' + hiredata._id,
                    substitutions: {
                      '-name-': hiredata.euserid.local.email,
                      '-instructions-': 'For more information, take a look at our help page,',
                      '-buttontext-': 'View More',
                      '-href-': 'http://maidicare.com/help/'
                    },
                    templateid: '6a0bf52e-9db6-42db-abb6-392169497e50'
                  })
                  newMail.sendEmailBcc(newMail, function (err, response) {
                    if (err) { return next(err) }
                    var newMail = new Mail({
                      from: 'support@maidicare.com',
                      to: [{email: hiredata.huserid.local.email}],
                      bcc: [{email: 'support@maidicare.com'},
                      {email: 'alexwongweilun@gmail.com'}],
                      subject: 'MaidiCare Shortlist Update',
                      message: 'Congratulations! Your hire request is successful. Our administrative team will be in touch with you shortly. HireID: ' + hiredata._id,
                      substitutions: {
                        '-name-': hiredata.huserid.local.email,
                        '-instructions-': 'For more information, take a look at our help page,',
                        '-buttontext-': 'View More',
                        '-href-': 'http://maidicare.com/help/'
                      },
                      templateid: '6a0bf52e-9db6-42db-abb6-392169497e50'
                    })
                    newMail.sendEmailBcc(newMail, function (err, response) {
                      if (err) { return next(err) }
                      res.send({status: 'success'})
                    })
                  })
                })
              })
            })
          })
        } else {
          res.send({
            status: 'error',
            message: 'You cannot hire any more helpers. To hire more than one helper, please contact \' support@maidicare.com\'.'
          })
        }
      } else if (req.body.status === 'Reject') {
        Hire.findOneAndUpdate({'_id': req.body.hireid}, {
          'lastactive': new Date(),
          'status': req.body.status.toLowerCase() + 'ed',
          'message': req.user.local.role.charAt(0).toUpperCase() + req.user.local.role.substring(1) + ' rejected the hire request. Hire unsuccessful.'
        }, function (err, hiredata) {
          if (err) { return next(err) }
          res.send({status: 'success'})
        })
      } else {
        res.send({
          status: 'error',
          message: 'Wrong value submitted.'
        })
      }
    } else {
      res.send({
        status: 'error',
        message: 'Your session has timed out. Please login again.'
      })
    }
  },
  postAJAXPersonalFilter: function (req, res, next) {
    if (req.body.filter && req.body.filter !== 'All') {
      req.body.filter = [req.body.filter]
    } else {
      req.body.filter = ['completed', 'confirmed', 'accepted', 'pending', 'rejected']
    }
    if (req.user.local.role === 'employer') {
      Hire.find({
        'euserid': req.user.id,
        'status': {$in: req.body.filter}
      })
      .sort({'_id': -1})
      .exec(function (err, hireArray) {
        if (err) { return next(err) }
        var idArray = []
        hireArray.forEach(function (hire) {
          idArray.push(hire.huserid)
        })
        Helper.find({'userid': {$in: idArray}}, function (err, userArray) {
          if (err) { return next(err) }
          var hireInfo = []
          // first loop to push x times
          // second loop to find the user
          for (var i = 0; i < hireArray.length; i++) {
            for (var j = 0; j < userArray.length; j++) {
              if (hireArray[i].huserid.toString() === userArray[j].userid.toString()) {
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
          Employer.findOne({'userid': req.user.id}, function (err, userInfo) {
            if (err) { return next(err) }
            res.send({
              role: 'employer',
              hireInfo: hireInfo
            })
          })
        })
      })
    } else {
      Hire.find({
        'huserid': req.user.id,
        'status': {$in: req.body.filter}
      })
      .sort({'_id': -1})
      .exec(function (err, hireArray) {
        if (err) { return next(err) }
        var idArray = []
        hireArray.forEach(function (hire) {
          idArray.push(hire.euserid)
        })
        Employer.find({'userid': {$in: idArray}}, function (err, userArray) {
          if (err) { return next(err) }
          var hireInfo = []
          // first loop to push x times
          // second loop to find the user
          for (var i = 0; i < hireArray.length; i++) {
            for (var j = 0; j < userArray.length; j++) {
              if (hireArray[i].euserid.toString() === userArray[j].userid.toString()) {
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
          Helper.findOne({'userid': req.user.id}, function (err, userInfo) {
            if (err) { return next(err) }
            res.send({
              role: 'helper',
              hireInfo: hireInfo
            })
          })
        })
      })
    }
  }
}
