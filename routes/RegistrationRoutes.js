const express = require('express')
const bodyparser = require('body-parser')
const router = express.Router()

const RegistrationController = require('../controllers/RegistrationController')

router.get('/registrations', RegistrationController.showRegistrations)

module.exports = router