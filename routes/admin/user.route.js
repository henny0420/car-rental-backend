const express = require('express')
const router = express.Router()
const CONTROLLER = require('../../controllers')
const { routeAccess } = require('../../middleware/routeAccess')

router.get('/user',
        routeAccess(true, ['admin']),
        CONTROLLER.USERADMIN.getAllUsers)
 
router.get('/owners',
        routeAccess(true, ['admin']),
        CONTROLLER.USERADMIN.getAllOwners)

router.get('/user/:id',
        routeAccess(true, ['admin']),
        CONTROLLER.USERADMIN.getUser)


router.patch('/user/:id/status',
        routeAccess(true, ['admin']),
        CONTROLLER.USERADMIN.updateUserStatus)

router.delete('/user/:id',
        routeAccess(true, ['admin']),
        CONTROLLER.USERADMIN.deleteUser)

module.exports = router