const express = require('express');
const router = express.Router();
const CONTROLLER = require('../../controllers/admin/car.controller');
const { routeAccess } = require('../../middleware/routeAccess');

router.get('/',
    routeAccess(true, ['admin']),
    CONTROLLER.getAllCars
);

router.patch('/:id/status',
    routeAccess(true, ['admin']),
    CONTROLLER.updateCarStatus
);

router.get('/pending',
    routeAccess(true, ['admin']),
    CONTROLLER.getPendingCars
);

router.put('/:id/approve',
    routeAccess(true, ['admin']),
    CONTROLLER.approveCar
);

module.exports = router;
