var Helper = require('../models/helper')
var Employer = require('../models/employer')
var Mail = require('../models/mail')

// export functions to index route
module.exports = {
  getHome: function (req, res) {
    res.render('index')
  },
  getAbout: function (req, res) {
    res.render('about')
  },
  getHelp: function (req, res) {
    res.render('help')
  },
  getSignup: function (req, res) {
    res.render('signup', { message: req.flash('signupMessage') })
  },
  getLogin: function (req, res) {
    res.render('login', { message: req.flash('loginMessage') })
  },
  getLogout: function (req, res) {
    req.logout()
    res.redirect('/')
  },
  postAJAXLoadContactUs: function (req, res, next) {
    var userid = req.params.idrole.split('&')[0]
    var userrole = req.params.idrole.split('&')[1]
    if (userrole === 'employer') {
      Employer.findOne({'userid': userid})
      .populate('userid')
      .exec(function (err, employerInfo) {
        if (!employerInfo || err) { res.send({status: 'error'}) }
        if (employerInfo) {
          res.send({
            status: 'success',
            name: employerInfo.profile.fullname,
            email: employerInfo.userid.local.email
          })
        }
      })
    } else {
      Helper.findOne({'userid': userid})
      .populate('userid')
      .exec(function (err, helperInfo) {
        if (err) { return next(err) }
        if (helperInfo) {
          res.send({
            status: 'success',
            name: helperInfo.profile.firstname + ' ' +
            helperInfo.profile.middlename + ' ' + helperInfo.profile.familyname,
            email: helperInfo.userid.local.email
          })
        }
      })
    }
  },
  postAJAXContactUs: function (req, res, next) {
    if (req.body.dinnertime === '') {
      var newMail = new Mail({
        from: req.body.email,
        to: [{email: 'support@maidicare.com'}],
        subject: 'MaidiCare Contact Us: ' + req.body.subject.replace(/_/g, ' '),
        message: req.body.message,
        substitutions: {
          '-name-': req.body.name,
          '-email-': req.body.email,
          '-subject-': req.body.subject.replace(/_/g, ' ')
        },
        templateid: '34a2faa3-1b06-44e1-a52c-1fc3cd695980'
      })
      newMail.sendEmail(newMail, function (err, response) {
        if (err) { return next(err) }
        res.send({status: 'success'})
      })
    } else {
      // not necessary as front end swal fires, but just in case
      var err = {
        message: 'Something went wrong with your sign up request. Please refresh the page and try again.'
      }
      return next(err)
    }
  }
}
