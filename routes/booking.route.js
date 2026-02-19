const express = require('express')
const { authenticateUser }  = require('../middleware/authenticate')
const router = express.Router()
const controller = require('../controllers')


router.post('/book',
        authenticateUser,
        controller.BOOKING.createBooking
)

module.exports = router;