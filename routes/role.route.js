const express=require('express')
const router = express.Router()
const   controllers = require('./../controllers')
const { routeAccess } = require('../middleware/routeAccess')
    
router.put('/update/:id', routeAccess(true,['admin']),controllers.ROLE.updateRoleController)

module.exports = router