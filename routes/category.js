const express = require('express')
const passport = require('passport')
const controller = require('../controllers/category')
const upload = require('../middleware/uploadFiles')
const router = express.Router()

const passportProtect = passport.authenticate('jwt',{session:false})
router.get('/',passportProtect,controller.getAll)
router.get('/:id',passportProtect,controller.getById)
router.delete('/:id',passportProtect,controller.remove)
router.post('/',passportProtect,upload.single('image'),controller.create)
router.patch('/:id',passportProtect,controller.update)

module.exports = router