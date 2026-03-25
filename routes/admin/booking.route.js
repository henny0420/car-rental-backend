const express = require('express');
const router = express.Router();
const CONTROLLER = require('../../controllers/admin/booking.controller');
const { routeAccess } = require('../../middleware/routeAccess');

router.get('/',
    routeAccess(true, ['admin']),
    CONTROLLER.getAllBookings
);

router.patch('/:id/status',
    routeAccess(true, ['admin']),
    CONTROLLER.updateBookingStatus
);

module.exports = router;
