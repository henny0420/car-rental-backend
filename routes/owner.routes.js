const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/owner.controller');
const { authenticateUser, authorize } = require('../middleware/authenticate');
const { upload } = require('../middleware/multer'); // Optional: adjust imports depending on if adding cars needs uploads here too

// Apply authentication and owner authorization to all routes in this file
router.use(authenticateUser);
router.use(authorize('owner'));

// ---- 1. Owner Car Management ----
// router.post('/cars', ownerController.addCar); // uncomment if owners add cars directly here
router.get('/cars', ownerController.getMyCars);
router.get('/cars/:id', ownerController.getSingleCar);
router.put('/cars/:id', ownerController.updateCar);
router.delete('/cars/:id', ownerController.deleteCar);

// ---- 2. Owner Booking Management ----
router.get('/bookings', ownerController.getAllBookings);
router.get('/bookings/:id', ownerController.getSingleBooking);
router.put('/bookings/:id/approve', ownerController.approveBooking);
router.put('/bookings/:id/reject', ownerController.rejectBooking);

// ---- 3. Owner Earnings ----
router.get('/earnings', ownerController.getEarnings);

// ---- 4. Owner Dashboard ----
router.get('/dashboard', ownerController.getDashboard);

// ---- 5. Owner Availability Control ----
router.put('/cars/:id/status', ownerController.updateCarAvailability);

module.exports = router;
