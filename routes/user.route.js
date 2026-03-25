const express = require('express')
const router=  express.Router();
const CONTROLLER = require('./../controllers')
const auth = require('../middleware/authenticate')
const { upload } = require('../middleware/multer')
const validate = require('../middleware/validator')
const validates = require('../validators')


router.post('/signup',
            validate(validates.USER.signupValidator),
            CONTROLLER.USER.SignupController)

router.post('/signin',
            validate(validates.USER.signinValidator),
            CONTROLLER.USER.SigninController)

router.get('/profile', auth.authenticateUser, CONTROLLER.USER.GetProfileController)
router.put('/profile', auth.authenticateUser, upload.single('profilePicture'), CONTROLLER.USER.UpdateProfileController)

module.exports = router