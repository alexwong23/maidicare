var express = require('express')
var router = express.Router()
var browseController = require('../controller/browseController')

// redirect to Browse /:query with '/browse/search?page=1'
router.get('/', browseController.getBrowse)

// Same as get /:query, but using values from AJAX Post and returning helper Array and count to front end
router.post('/filter', browseController.postAJAXBrowseFilter)

/**
* @name Browse View Page
*
* Before can Render Page, some validation is done,
* Validation
*     Check if Helper exists using id provided in url
*     Check if Helper can be hired
*         true, Check if helper completed profile & activate
*             true, @name RENDER
*             false, error: 'helper has profile incomplete etc...'
*         false, Check if user is logged in
*             true, Check if user is the helper herself
*                  true, @name RENDER
*                  false, Check if user is employer who 'confirm'
*                     true, @name RENDER
*                     false, error: 'Helper hired'
*             false, error: 'Helper has been hired'
*
* RENDER SUCCESS (steps below)
* extract query from url
*     place query into var
*     (if value not true, find both true & false)
*
* Render Browse View page with:
*     related Array of helpers
*         not including selected helper
*         not inactive (nvr login for more than 1 month)
*         similar skills & nationality
*         sorted similar to browse page
*     array of hired helpers, notify employer if hired alr
*         if not login or helper, empty array
*         if employer, find helpers hired & shortlisted
*
*/
router.get('/view/:id', browseController.getBrowseView)

/**
* @name AJAX Post Hire
*
* Employer selects Helper for shortlist
*
* Before can shortlist, some validation is done,
* Validation
*     User logged in
*     is Employer & can hire & completed profile
*     is Helper is hired
*     if Employer already hired Helper
*
* If success
*     Create new shortlist with status pending
*     Send email to helper to inform of new shortlist
*/
router.post('/hire', browseController.postAJAXBrowseHire)

/**
* @name Browse Page
*
* extract query from url
*     place query into var
*     (if value not true, find both true & false)
*
* find & count Helpers who:
*     completed profile, activated account, can be hired
*     not inactive (nvr login for more than 1 month)
*     fulfill the query criteria
*
* Using Search Text
*     if nvr use search text, use normal queries
*         sorted by
*             photo exists
*             when account created (most recent first)
*             transfer (transfer priority first)
*             speak english (speak english priority first)
*     if use search text, use $text mongoIndex
*         sorted by Mongo $text metascore
*
* Render Browse Page with:
*     Array of helpers with their info
*         maximum 12 helpers per render
*         Using mongo skip and pages to divide helpers
*     Number of helpers in array
*/
router.get('/:query', browseController.getBrowseQuery)

module.exports = router
