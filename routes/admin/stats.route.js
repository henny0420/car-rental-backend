const express = require('express');
const router = express.Router();
const CONTROLLER = require('../../controllers/admin/stats.controller');
const { routeAccess } = require('../../middleware/routeAccess');

router.get('/',
    routeAccess(true, ['admin']),
    CONTROLLER.getDashboardStats
);

module.exports = router;
