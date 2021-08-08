const express = require('express')
const controller = require('../controllers/analytics')
const passport = require('passport')
const router = express.Router()

const passportProtect = passport.authenticate('jwt',{session:false})
router.get('/overview',passportProtect,controller.overview)
router.get('/analytics',passportProtect,controller.analytics)

module.exports = router