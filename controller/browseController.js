// commented lastactive filter since helper dont login themselves

var User = require('../models/user')
var Helper = require('../models/helper')
var Hire = require('../models/hire')
var Mail = require('../models/mail')
var url = require('url')

// callback to set query values
function queryValues (query, queryobj) {
  if (query.infantcare === 'true') {
    queryobj.infantcare = [true]
  } else {
    queryobj.infantcare = [true, false]
  }
  if (query.childcare === 'true') {
    queryobj.childcare = [true]
  } else {
    queryobj.childcare = [true, false]
  }
  if (query.elderlycare === 'true') {
    queryobj.elderlycare = [true]
  } else {
    queryobj.elderlycare = [true, false]
  }
  if (query.disabledcare === 'true') {
    queryobj.disabledcare = [true]
  } else {
    queryobj.disabledcare = [true, false]
  }
  if (query.transfer === 'true') {
    queryobj.transfer = [true]
  } else if (query.transfer === 'false') {
    queryobj.transfer = [false]
  } else {
    queryobj.transfer = [true, false]
  }
  if (query.singapore === 'true') {
    queryobj.singapore = [true]
  } else if (query.singapore === 'false') {
    queryobj.singapore = [false]
  } else {
    queryobj.singapore = [true, false]
  }
  if (query.nationality && query.nationality !== 'All') {
    queryobj.nationality = [query.nationality]
  } else {
    queryobj.nationality = ['Philippines', 'India', 'Indonesia', 'Myanmar', 'Sri_Lanka']
  }
  if (query.religion && query.religion !== 'All') {
    queryobj.religion = [query.religion]
  } else {
    queryobj.religion = ['Buddhist', 'Catholic', 'Christian', 'Hinduism', 'Islam', 'Taoist', 'Others']
  }
  if (query.maritalstatus && query.maritalstatus !== 'All') {
    queryobj.maritalstatus = [query.maritalstatus]
  } else {
    queryobj.maritalstatus = ['Single', 'Married', 'Widowed', 'Separated', 'Divorced']
  }
  return queryobj
}

// export functions to browse routes
module.exports = {
  getBrowse: function (req, res) {
    res.redirect('/browse/search?page=1')
  },
  getBrowseQuery: function (req, res, next) {
    var query = url.parse(req.url, true).query
    var queryobj = {
      infantcare: [],
      childcare: [],
      elderlycare: [],
      disabledcare: [],
      transfer: [],
      singapore: [],
      nationality: [],
      religion: [],
      maritalstatus: []
    }
    queryValues(query, queryobj)
    var pageInt = parseInt(query.page, 10)
    if (Number.isInteger(pageInt) && pageInt > 0) {
      User.find({'available': true, 'hire': true, 'activate.status': true}, function (err, userInfo) {
        if (err) { return next(err) }
        var idarray = userInfo.map(function (user) {
          return user._id
        })
        if (!query.query || query.query === '') {
          Helper.count({
            'userid': {$in: idarray},
            // 'lastactive': {$gt: new Date(new Date().setMonth(new Date().getMonth() - 1))},
            'skills.infantcare': {$in: queryobj.infantcare},
            'skills.childcare': {$in: queryobj.childcare},
            'skills.elderlycare': {$in: queryobj.elderlycare},
            'skills.disabledcare': {$in: queryobj.disabledcare},
            'transfer': {$in: queryobj.transfer},
            'skills.singapore': {$in: queryobj.singapore},
            'profile.nationality': {$in: queryobj.nationality},
            'profile.religion': {$in: queryobj.religion},
            'profile.maritalstatus': {$in: queryobj.maritalstatus}
          }).exec(function (err, totalResults) {
            if (err) { return next(err) }
            Helper.find({
              'userid': {$in: idarray},
              // 'lastactive': {$gt: new Date(new Date().setMonth(new Date().getMonth() - 1))},
              'skills.infantcare': {$in: queryobj.infantcare},
              'skills.childcare': {$in: queryobj.childcare},
              'skills.elderlycare': {$in: queryobj.elderlycare},
              'skills.disabledcare': {$in: queryobj.disabledcare},
              'transfer': {$in: queryobj.transfer},
              'skills.singapore': {$in: queryobj.singapore},
              'profile.nationality': {$in: queryobj.nationality},
              'profile.religion': {$in: queryobj.religion},
              'profile.maritalstatus': {$in: queryobj.maritalstatus}
            })
            .sort({'profile.photo.exists': -1, '_id': -1, 'transfer': -1, 'skills.english': -1})
            .limit(12)                // show 12
            .skip((pageInt - 1) * 12) // skip 12
            .exec(function (err, helperInfo) {
              if (err) { return next(err) }
              res.render('browse/index', {
                message: req.flash('browseMessage'),
                totalResults: totalResults,
                helperInfo: helperInfo
              })
            })
          })
        } else {
          Helper.count({
            $text: {
              $search: query.query,
              $caseSensitive: false,
              $language: 'en'
            },
            'userid': {$in: idarray},
            // 'lastactive': {$gt: new Date(new Date().setMonth(new Date().getMonth() - 1))},
            'skills.infantcare': {$in: queryobj.infantcare},
            'skills.childcare': {$in: queryobj.childcare},
            'skills.elderlycare': {$in: queryobj.elderlycare},
            'skills.disabledcare': {$in: queryobj.disabledcare},
            'transfer': {$in: queryobj.transfer},
            'skills.singapore': {$in: queryobj.singapore},
            'profile.nationality': {$in: queryobj.nationality},
            'profile.religion': {$in: queryobj.religion},
            'profile.maritalstatus': {$in: queryobj.maritalstatus}
          }).exec(function (err, totalResults) {
            if (err) { return next(err) }
            Helper.find({
              $text: {
                $search: query.query,
                $caseSensitive: false,
                $language: 'en'
              },
              'userid': {$in: idarray},
              // 'lastactive': {$gt: new Date(new Date().setMonth(new Date().getMonth() - 1))},
              'skills.infantcare': {$in: queryobj.infantcare},
              'skills.childcare': {$in: queryobj.childcare},
              'skills.elderlycare': {$in: queryobj.elderlycare},
              'skills.disabledcare': {$in: queryobj.disabledcare},
              'transfer': {$in: queryobj.transfer},
              'skills.singapore': {$in: queryobj.singapore},
              'profile.nationality': {$in: queryobj.nationality},
              'profile.religion': {$in: queryobj.religion},
              'profile.maritalstatus': {$in: queryobj.maritalstatus}
            },
            {score: {$meta: 'textScore'}})
            .sort({score: {$meta: 'textScore'}})
            .limit(12)                // show 12
            .skip((pageInt - 1) * 12) // skip 12
            .exec(function (err, helperInfo) {
              if (err) { return next(err) }
              res.render('browse/index', {
                message: req.flash('browseMessage'),
                totalResults: totalResults,
                helperInfo: helperInfo
              })
            })
          })
        }
      })
    } else {
      res.status(404)
      res.render('error', {
        title: '404',
        error: 'Page not found :(',
        message: 'Unfortunately, this page does not exist.'
      })
    }
  },
  postAJAXBrowseFilter: function (req, res, next) {
    var filterobj = {
      infantcare: [],
      childcare: [],
      elderlycare: [],
      disabledcare: [],
      transfer: [],
      singapore: [],
      nationality: [],
      religion: [],
      maritalstatus: []
    }
    queryValues(req.body, filterobj)
    var pageInt = parseInt(req.body.page, 10)
    if (Number.isInteger(pageInt) && pageInt > 0) {
      User.find({'available': true, 'hire': true, 'activate.status': true}, function (err, userInfo) {
        if (err) { return next(err) }
        var idarray = userInfo.map(function (user) {
          return user._id
        })
        if (!req.body.query || req.body.query === '') {
          Helper.count({
            'userid': {$in: idarray},
            // 'lastactive': {$gt: new Date(new Date().setMonth(new Date().getMonth() - 1))},
            'skills.infantcare': {$in: filterobj.infantcare},
            'skills.childcare': {$in: filterobj.childcare},
            'skills.elderlycare': {$in: filterobj.elderlycare},
            'skills.disabledcare': {$in: filterobj.disabledcare},
            'transfer': {$in: filterobj.transfer},
            'skills.singapore': {$in: filterobj.singapore},
            'profile.nationality': {$in: filterobj.nationality},
            'profile.religion': {$in: filterobj.religion},
            'profile.maritalstatus': {$in: filterobj.maritalstatus}
          })
          .exec(function (err, totalResults) {
            if (err) { return next(err) }
            Helper.find({
              'userid': {$in: idarray},
              // 'lastactive': {$gt: new Date(new Date().setMonth(new Date().getMonth() - 1))},
              'skills.infantcare': {$in: filterobj.infantcare},
              'skills.childcare': {$in: filterobj.childcare},
              'skills.elderlycare': {$in: filterobj.elderlycare},
              'skills.disabledcare': {$in: filterobj.disabledcare},
              'transfer': {$in: filterobj.transfer},
              'skills.singapore': {$in: filterobj.singapore},
              'profile.nationality': {$in: filterobj.nationality},
              'profile.religion': {$in: filterobj.religion},
              'profile.maritalstatus': {$in: filterobj.maritalstatus}
            })
            .sort({'profile.photo.exists': -1, '_id': -1, 'transfer': -1, 'skills.english': -1})
            .limit(12)                // show 12
            .skip((pageInt - 1) * 12) // skip 12
            .exec(function (err, helperInfo) {
              if (err) { return next(err) }
              res.send({
                totalResults: totalResults,
                helperInfo: helperInfo
              })
            })
          })
        } else {
          Helper.count({
            $text: {
              $search: req.body.query,
              $caseSensitive: false,
              $language: 'en'
            },
            'userid': {$in: idarray},
            // 'lastactive': {$gt: new Date(new Date().setMonth(new Date().getMonth() - 1))},
            'skills.infantcare': {$in: filterobj.infantcare},
            'skills.childcare': {$in: filterobj.childcare},
            'skills.elderlycare': {$in: filterobj.elderlycare},
            'skills.disabledcare': {$in: filterobj.disabledcare},
            'transfer': {$in: filterobj.transfer},
            'skills.singapore': {$in: filterobj.singapore},
            'profile.nationality': {$in: filterobj.nationality},
            'profile.religion': {$in: filterobj.religion},
            'profile.maritalstatus': {$in: filterobj.maritalstatus}
          })
          .exec(function (err, totalResults) {
            if (err) { return next(err) }
            Helper.find({
              $text: {
                $search: req.body.query,
                $caseSensitive: false,
                $language: 'en'
              },
              'userid': {$in: idarray},
              // 'lastactive': {$gt: new Date(new Date().setMonth(new Date().getMonth() - 1))},
              'skills.infantcare': {$in: filterobj.infantcare},
              'skills.childcare': {$in: filterobj.childcare},
              'skills.elderlycare': {$in: filterobj.elderlycare},
              'skills.disabledcare': {$in: filterobj.disabledcare},
              'transfer': {$in: filterobj.transfer},
              'skills.singapore': {$in: filterobj.singapore},
              'profile.nationality': {$in: filterobj.nationality},
              'profile.religion': {$in: filterobj.religion},
              'profile.maritalstatus': {$in: filterobj.maritalstatus}
            },
            {score: {$meta: 'textScore'}})
            .sort({score: {$meta: 'textScore'}})
            .limit(12)                // show 12
            .skip((pageInt - 1) * 12) // skip 12
            .exec(function (err, helperInfo) {
              if (err) { return next(err) }
              res.send({
                totalResults: totalResults,
                helperInfo: helperInfo
              })
            })
          })
        }
      })
    } else {
      res.status(404)
      res.render('error', {
        title: '404',
        error: 'Page not found :(',
        message: 'Unfortunately, this page does not exist.'
      })
    }
  },
  getBrowseView: function (req, res, next) {
    function flashRedirect (flashmessage, text, url) {
      req.flash(flashmessage + 'Message', text)
      return res.redirect(url)
    }
    function findRelatedAndRender (helperInfo) {
      var query = {
        infantcare: [],
        childcare: [],
        elderlycare: [],
        disabledcare: []
        // singapore: []
      }
      if (helperInfo.skills.infantcare) {
        query.infantcare = [true]
      } else {
        query.infantcare = [true, false]
      }
      if (helperInfo.skills.childcare) {
        query.childcare = [true]
      } else {
        query.childcare = [true, false]
      }
      if (helperInfo.skills.elderlycare) {
        query.elderlycare = [true]
      } else {
        query.elderlycare = [true, false]
      }
      if (helperInfo.skills.disabledcare) {
        query.disabledcare = [true]
      } else {
        query.disabledcare = [true, false]
      }
      // if (helperInfo.skills.singapore) {
      //   query.singapore = [true]
      // } else {
      //   query.singapore = [true, false]
      // }
      User.find({'_id': {$ne: helperInfo.userid}, 'available': true, 'hire': true, 'activate.status': true}, function (err, userInfo) {
        if (err) { return next(err) }
        var idarray = userInfo.map(function (user) {
          return user._id
        })
        Helper.find({
          'userid': {$in: idarray},
          // 'lastactive': {$gt: new Date(new Date().setMonth(new Date().getMonth() - 1))},
          // 'transfer': helperInfo.transfer,
          'skills.infantcare': {$in: query.infantcare},
          'skills.childcare': {$in: query.childcare},
          'skills.elderlycare': {$in: query.elderlycare},
          'skills.disabledcare': {$in: query.disabledcare}
          // 'skills.singapore': {$in: query.singapore},
          // 'profile.nationality': helperInfo.profile.nationality
        })
        .sort({'profile.photo.exists': -1, '_id': -1, 'transfer': -1, 'skills.english': -1})
        .limit(4)
        .exec(function (err, relatedArray) {
          if (err) { return next(err) }
          if (!req.user || req.user.local.role === 'helper') {
            var hiredArray = [{}]
            return res.render('browse/view', {
              message: req.flash('viewMessage'),
              helperInfo: helperInfo,
              hiredArray: hiredArray,
              relatedArray: relatedArray
            })
          } else {
            Hire.find({'euserid': req.user.id, 'status': {$nin: ['rejected', 'completed']}}, function (err, hiredArray) {
              if (err) { return next(err) }
              return res.render('browse/view', {
                message: req.flash('viewMessage'),
                helperInfo: helperInfo,
                hiredArray: hiredArray,
                relatedArray: relatedArray
              })
            })
          }
        })
      })
    }
    Helper.findOne({'_id': req.params.id}, function (err, helperInfo) {
      if (err || !helperInfo) {
        if (req.user) {
          flashRedirect('user', 'Sorry, we could not find this helper in the database.', '/users')
        } else {
          flashRedirect('login', 'Sorry, we could not find this helper in the database.', '/login')
        }
      } else {
        // cannot populate not frontend can see user details
        User.findOne({'_id': helperInfo.userid}, function (err, userInfo) {
          if (err) { return next(err) }
          if (userInfo.hire) {
            if (userInfo.available && userInfo.activate.status) {
              findRelatedAndRender(helperInfo)
            } else {
              if (req.user) {
                flashRedirect('user', 'Sorry, cannot view this helper\'s details as it is incomplete.', '/users')
              } else {
                flashRedirect('login', 'Sorry, cannot view this helper\'s details as it is incomplete.', '/login')
              }
            }
          } else {
            if (req.user) {
              if (helperInfo.userid.toString() === req.user.id) {
                findRelatedAndRender(helperInfo)
              } else {
                Hire.findOne({
                  'euserid': req.user.id,
                  'huserid': helperInfo.userid,
                  'status': 'confirmed'
                }, function (err, hireInfo) {
                  if (err) { return next(err) }
                  if (hireInfo) {
                    findRelatedAndRender(helperInfo)
                  } else {
                    flashRedirect('user', 'Sorry, this helper\'s has already been hired.', '/users')
                  }
                })
              }
            } else {
              flashRedirect('login', 'Sorry, this helper\'s has already been hired.', '/login')
            }
          }
        })
      }
    })
  },
  postAJAXBrowseHire: function (req, res, next) {
    function AJAXflashRedirect (flashmessage, text, url) {
      req.flash(flashmessage + 'Message', text)
      return res.send({status: 'redirect', message: url})
    }
    if (req.user) {
      if (req.user.local.role === 'employer') {
        if (req.user.hire) {
          if (req.user.recruit) {
            User.findOne({'_id': req.body.helperuserid}, function (err, helperInfo) {
              if (err) { return next(err) }
              if (helperInfo.hire) {
                Hire.findOne({
                  'huserid': req.body.helperuserid,
                  'euserid': req.user.id,
                  'status': {$nin: ['rejected', 'completed']}
                }, function (err, hiredbefore) {
                  if (err) { return next(err) }
                  if (!hiredbefore) {
                    var newHire = new Hire({
                      huserid: req.body.helperuserid,
                      euserid: req.user.id,
                      status: 'pending',
                      message: 'Awaiting response from Helper.'
                    })
                    newHire.save(function (err) {
                      if (err) { return next(err) }
                      var newMail = new Mail({
                        from: 'support@maidicare.com',
                        to: [{email: helperInfo.local.email}],
                        bcc: [{email: 'support@maidicare.com'},
                        {email: 'alexwongweilun@hotmail.co.uk'}],
                        subject: 'MaidiCare Shortlist Update',
                        message: 'An employer has SELECTED your profile and is waiting for your response.',
                        substitutions: {
                          '-name-': helperInfo.local.email,
                          '-instructions-': 'Click the button or copy the link below to respond,',
                          '-buttontext-': 'View Shortlists',
                          '-href-': 'http://maidicare.com/users/shortlists'
                        },
                        templateid: '6a0bf52e-9db6-42db-abb6-392169497e50'
                      })
                      newMail.sendEmailBcc(newMail, function (err, response) {
                        if (err) { return next(err) }
                        res.send({status: 'success', message: 'Your request has been sent to the helper. Please wait for her reply.'})
                      })
                    })
                  } else {
                    res.send({status: 'error', message: 'You already selected this helper!'})
                  }
                })
              } else {
                AJAXflashRedirect('user', 'Sorry, but this helper has been hired.', '/users/' + req.user.id)
              }
            })
          } else {
            AJAXflashRedirect('user', 'Please fill in all your Personal Details before hiring.', '/users/' + req.user.id)
          }
        } else {
          res.send({status: 'error', message: 'You have already confirmed a helper. To hire more than one helper, please contact \' support@maidicare.com\'.'})
        }
      } else {
        AJAXflashRedirect('user', 'Your role does not allow you to hire helpers. Please contact our support team for further assistance.', '/users/' + req.user.id)
      }
    } else {
      AJAXflashRedirect('login', 'Please login to your account to start hiring.', '/login')
    }
  },
  postAJAXBrowseSkype: function (req, res, next) {
    function AJAXflashRedirect (flashmessage, text, url) {
      req.flash(flashmessage + 'Message', text)
      return res.send({status: 'redirect', message: url})
    }
    if (req.user) {
      if (req.user.local.role === 'employer') {
        if (req.user.recruit) {
          User.findOne({'_id': req.body.helperuserid}, function (err, helperInfo) {
            if (err) { return next(err) }
            if (helperInfo.hire) {
              if (req.user.hire) {
                var newMail = new Mail({
                  from: req.user.local.email,
                  to: [{email: 'support@maidicare.com'}],
                  bcc: [{email: 'alexwongweilun@hotmail.co.uk'}],
                  subject: 'MaidiCare Skype Request',
                  message: 'Employer, \'' + req.user.local.email + '\', has requested to Skype call helper, \'' + helperInfo.local.email + '\'.',
                  substitutions: {
                    '-name-': 'MaidiCare Admin',
                    '-instructions-': 'Set up Skype call by manually emailing both employer and helper for their skype particulars',
                    '-buttontext-': 'MaidiCare Email',
                    '-href-': 'https://privateemail.com/'
                  },
                  templateid: '6a0bf52e-9db6-42db-abb6-392169497e50'
                })
                newMail.sendEmailBcc(newMail, function (err, response) {
                  if (err) { return next(err) }
                  res.send({status: 'success', message: 'Your Skype request has been sent. We will get back to you in two business days.'})
                })
              } else {
                res.send({status: 'error', message: 'You have already confirmed a helper. To hire more than one helper, please contact \' support@maidicare.com\'.'})
              }
            } else {
              Hire.findOne({
                'euserid': req.user.id,
                'huserid': req.body.helperuserid,
                'status': {$in: ['confirmed']}
              }, function (err, hiredbefore) {
                if (err) { return next(err) }
                if (hiredbefore) {
                  var newMail = new Mail({
                    from: req.user.local.email,
                    to: [{email: 'support@maidicare.com'}],
                    bcc: [{email: 'alexwongweilun@hotmail.co.uk'}],
                    subject: 'MaidiCare Skype Request',
                    message: 'Employer, \'' + req.user.local.email + '\', has requested to Skype call helper, \'' + helperInfo.local.email + '\'.',
                    substitutions: {
                      '-name-': 'MaidiCare Admin',
                      '-instructions-': 'Set up Skype call by manually emailing both employer and helper for their skype particulars',
                      '-buttontext-': 'MaidiCare Email',
                      '-href-': 'https://privateemail.com/'
                    },
                    templateid: '6a0bf52e-9db6-42db-abb6-392169497e50'
                  })
                  newMail.sendEmailBcc(newMail, function (err, response) {
                    if (err) { return next(err) }
                    res.send({status: 'success', message: 'Your Skype request has been sent. We will get back to you in two business days.'})
                  })
                } else {
                  AJAXflashRedirect('user', 'Sorry, but this helper has been hired.', '/users/' + req.user.id)
                }
              })
            }
          })
        } else {
          AJAXflashRedirect('user', 'Please fill in all your Personal Details before sending a skype request.', '/users/' + req.user.id)
        }
      } else {
        AJAXflashRedirect('user', 'Your role does not allow you to send a skype request. Please contact our support team for further assistance.', '/users/' + req.user.id)
      }
    } else {
      AJAXflashRedirect('login', 'Please login to your account to send a skype request.', '/login')
    }
  }
}
