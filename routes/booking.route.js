const express = require('express')
const { authenticateUser } = require('../middleware/authenticate')
const router = express.Router()
const controller = require('../controllers')


router.post('/book',
        authenticateUser,
        controller.BOOKING.createBooking
)

router.get('/my-bookings',
        authenticateUser,
        controller.BOOKING.getMyBookings
)

router.put('/cancel/:id',
        authenticateUser,
        controller.BOOKING.cancelBooking
)

module.exports = router;