var express = require('express')
var router = express.Router()
var apiController = require('../controller/apiController')

// 3 fake helpers, and 2 fake employers
router.get('/users/data', apiController.getAJAXUsersData)

// saves fake data
router.post('/users/demo', apiController.postAJAXUsersDemo)

// removes fake data from Schemas using email and names
router.delete('/users/remove', apiController.removeAJAXUsersData)

module.exports = router
