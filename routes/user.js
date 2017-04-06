var express = require('express')
var router = express.Router()
var userController = require('../controller/userController')
var multer = require('multer')
// Multer storage options
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({storage: storage})

// middleware user check function
// if user is already login, allow codes to continue
// if user is not login, redirect to login page with flash
function userCheck (req, res, next) {
  if (req.isAuthenticated(req, res, next)) {
    return next()
  } else {
    req.flash('loginMessage', 'You have not logged in!')
    return res.redirect('/login')
  }
}

// similar to userCheck but for Posts to render diff flashmsg
function userPostCheck (req, res, next) {
  if (req.isAuthenticated(req, res, next)) {
    return next()
  } else {
    req.flash('loginMessage', 'Your session has timed out. Please login again.')
    return res.redirect('/login')
  }
}

// Allows helpers who have not activated to proceed
// else Redirected
function activateCheck (req, res, next) {
  if (!req.user.activate.status && req.user.local.role === 'helper') {
    return next()
  } else {
    req.flash('userMessage', 'Your account has already been activated.')
    return res.redirect('/users')
  }
}

// redirect to users/:id (personal profile page)
router.get('/', userCheck, userController.getProfile)

// redirect to users/:id/edit (edit profile page)
router.get('/edit', userCheck, userController.getEdit)

// redirect to users/:id/shortlists (hire profile page)
router.get('/shortlists', userCheck, userController.getHire)

// redirect to users/:id/activate (activate profile page)
router.get('/activate', userController.getActivate)

// ajax post to check if email taken (used in Signup Email field)
router.post('/emailtaken', userController.postAJAXEmailTaken)

/**
* @name Post Upload photo
*
* Helper Uploads photo, saves photo in multer first
*
* Before can upload, some validation is done,
* Validation
*     User logged in
*     File exists
*     File must be an image smaller than 7mb
* if false, delete the photo saved in multer
*
* If successful
*     Delete existing user photo in Cloudinary using helperid
*     Upload the new photo to Cloudinary
*     Rename the new photo to helperid in Cloudinary
*     Update Helper photo fields to new photo version & format
*     Check and delete photo saved in multer directory (/uploads)
*/
router.post('/uploadphoto', upload.single('photo'), userController.postPersonalPhoto)

// render employer view from helper profile hire
// Render only for helpers who have been hired by the employer
router.get('/employer/:id', userCheck, userController.getEmployerView)

// render user personal profile page
// updates helper lastactive field
router.get('/:id', userCheck, userController.getPersonal)

/**
* @name User Edit Profile Page
*
* Get Renders user edit page
*
* Post for both Helper & Employer Profile
* Allows for both Save & Submit
*     Save
*     Validation
*         All fields in correct format & length
*     Submit
*     Validation
*         Same as save but all fields must be filled
* If Success, update that User completed profile
*/
router.route('/:id/edit')
      .get(userCheck, userController.getPersonalEdit)
      .put(userPostCheck, userController.putPersonalEdit)

/**
* @name User Activate Profile Page
*
* Get Renders user activate page
*     Validation handled by ActivateCheck middleware above
*
* Post Activates Helper Account
* Take Code from req.body
*     Authenticate code using User method
* If Success, activate Helper account
*/
router.route('/:id/activate')
      .get(userCheck, activateCheck, userController.getPersonalActivate)
      .post(userPostCheck, activateCheck, userController.postPersonalActivate)

/**
* @name Ajax Post Activate reset code
*
* Handles own validation
*     User logged in, and is unactivated helper
* Generate, hash, save and email new code to helper email
*/
router.post('/:id/activate/reset', userController.postAJAXPersonalActivateReset)

// render profile activate success, no need activateCheck
router.get('/:id/activate/success', userCheck, userController.getPersonalActivateSuccess)

// user activate using email url
// similar to Post Activate Helper, but using params
router.get('/:id/activate/:code', userCheck, activateCheck, userController.getPersonalActivateUrl)

/**
* @name User Hire Page
*
* Get Hire Page (different for helper & employer)
* Render Page with
*     User Profile
*     Array of User's Shortlists with other party info
*
*
* AJAX Post User New shortlist status
* Validation: If user logged in, continue
* If Helper Accept Shortlist
*     Check if Helper accept/confirm another shortlist
*          true: 'error'
*          false: update shortlist & email employer
*
* If Employer Confirms Shortlist
*     Check if Employer can hire
*          true:
*               update shortlist
*               reject helper's existing pending/accept
*               reject employer's existing pending/accept
*               prevent helper & employer from hiring
*               email helper, employer & support mail
*          false: 'error'
*
* If Reject, reject the shortlist using the hireid
*/
router.route('/:id/shortlists')
      .get(userCheck, userController.getPersonalHire)
      .post(userController.postAJAXPersonalHire)

/**
* @name Ajax Post Hire Filter (diff for helper/employer)
*
* Find Shortlists using req.body.filter
*     return user's shortlists with other party info
*/
router.post('/:id/shortlists/filter', userController.postAJAXPersonalFilter)

module.exports = router
