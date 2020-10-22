const express = require('express')
const passport = require('passport')
const controller = require('../controllers/order')
const router = express.Router()

const passportProtect = passport.authenticate('jwt',{session:false})

router.get('/',passportProtect,controller.getAll)
router.get('/',passportProtect,controller.create)

module.exports = router