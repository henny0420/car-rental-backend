const express = require('express')
const router = express.Router()
const DB = require('./../models')
const controller = require('./../controllers')
const { routeAccess } = require('../middleware/routeAccess')


router.post('/add',
    routeAccess(true,['admin']),
    controller.COUPAN.addCoupan
)
router.get('/all',controller.COUPAN.getAllCoupan)
router.put('/update/:id',controller.COUPAN.updateCoupan)
router.delete('/delete/:id',controller.COUPAN.deleteCoupan)

module.exports = router;