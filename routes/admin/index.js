const express = require('express')
const router = express.Router()

router.use('/', require('./user.route'))
router.use('/car', require('./car.route'))
router.use('/booking', require('./booking.route'))
router.use('/stats', require('./stats.route'))

module.exports = router
