const express = require('express')
const router=  express.Router();
const CONTROLLER = require('./../controllers')
const auth = require('../middleware/authenticate')
const validate = require('../middleware/validator')
const validates = require('../validators')


router.post('/signup',
            validate(validates.USER.signupValidator),
            CONTROLLER.USER.SignupController)

router.post('/signin',
            validate(validates.USER.signinValidator),
            CONTROLLER.USER.SigninController)
console.log(CONTROLLER.USER)


module.exports = router