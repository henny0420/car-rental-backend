const express = require('express')
const router = express.Router()
const DB = require('../models')
const auth = require('../middleware/authenticate')
const CONTROLLERS = require('./../controllers')
const { upload } = require('../middleware/multer')
const { routeAccess } = require('../middleware/routeAccess')

router.post('/add', routeAccess(true,['admin']) ,upload.single('logo'),CONTROLLERS.BRAND.AddBrand)
router.get('/brands/:id',CONTROLLERS.BRAND.GetAllBrnadController)
router.get('/brands',CONTROLLERS.BRAND.GetAllBrnadController)
router.put('/:id',CONTROLLERS.BRAND.UpdateBrandController)
router.delete('/:id',CONTROLLERS.BRAND.DeleteBrandController)

module.exports =router