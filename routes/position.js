const express = require('express')
const passport = require('passport')
const controller = require('../controllers/position')
const router = express.Router()

const passportProtect = passport.authenticate('jwt',{session:false})

router.get('/:categoryID',passportProtect,controller.getByCategoryId)
router.post('/',passportProtect,controller.create)
router.patch('/:id',passportProtect,controller.update)
router.delete('/:id',passportProtect,controller.remove)

module.exports = router