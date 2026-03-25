const ownerService = require('../services/owner.service');

// ---- Car Management ----
const addCar = async (req, res) => {
    try {
        const carData = req.body;
        const ownerId = req.user._id;

        // If you are using multer, you might need to handle req.files here
        // as you did in the original car controller.
        if (req.files && req.files.coverImage) {
            carData.coverImage = { url: req.files.coverImage[0].path, public_id: req.files.coverImage[0].filename };
        }
        if (req.files && req.files.galleryImages) {
            carData.galleryImages = req.files.galleryImages.map(f => ({ url: f.path, public_id: f.filename }));
        }

        const newCar = await ownerService.createCar(carData, ownerId);
        return res.status(201).json({ success: true, message: 'Car added successfully', data: newCar });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getMyCars = async (req, res) => {
    try {
        const cars = await ownerService.getMyCars(req.user._id);
        return res.status(200).json({ success: true, data: cars });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getSingleCar = async (req, res) => {
    try {
        const car = await ownerService.getCarById(req.params.id, req.user._id);
        if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
        return res.status(200).json({ success: true, data: car });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updateCar = async (req, res) => {
    try {
        const updatedCar = await ownerService.updateCar(req.params.id, req.body, req.user._id);
        if (!updatedCar) return res.status(404).json({ success: false, message: 'Car not found or unauthorized' });
        return res.status(200).json({ success: true, message: 'Car updated successfully', data: updatedCar });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteCar = async (req, res) => {
    try {
        const deleted = await ownerService.deleteCar(req.params.id, req.user._id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Car not found or unauthorized' });
        return res.status(200).json({ success: true, message: 'Car deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updateCarAvailability = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) return res.status(400).json({ success: false, message: 'Status is required' });

        const updatedCar = await ownerService.updateCarStatus(req.params.id, status, req.user._id);
        if (!updatedCar) return res.status(404).json({ success: false, message: 'Car not found' });
        return res.status(200).json({ success: true, message: 'Car status updated', data: updatedCar });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ---- Booking Management ----
const getAllBookings = async (req, res) => {
    try {
        const bookings = await ownerService.getMyBookings(req.user._id);
        return res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getSingleBooking = async (req, res) => {
    try {
        const booking = await ownerService.getBookingById(req.params.id, req.user._id);
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
        return res.status(200).json({ success: true, data: booking });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const approveBooking = async (req, res) => {
    try {
        const updated = await ownerService.updateBookingStatus(req.params.id, 'approved', req.user._id);
        if (!updated) return res.status(404).json({ success: false, message: 'Booking not found' });
        return res.status(200).json({ success: true, message: 'Booking approved', data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const rejectBooking = async (req, res) => {
    try {
        const updated = await ownerService.updateBookingStatus(req.params.id, 'cancelled', req.user._id);
        if (!updated) return res.status(404).json({ success: false, message: 'Booking not found' });
        return res.status(200).json({ success: true, message: 'Booking rejected', data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ---- Dashboard and Earnings ----
const getEarnings = async (req, res) => {
    try {
        const earnings = await ownerService.getEarnings(req.user._id);
        return res.status(200).json({ success: true, data: { totalEarnings: earnings } });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getDashboard = async (req, res) => {
    try {
        const stats = await ownerService.getDashboardStats(req.user._id);
        return res.status(200).json({ success: true, data: stats });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addCar, getMyCars, getSingleCar, updateCar, deleteCar, updateCarAvailability,
    getAllBookings, getSingleBooking, approveBooking, rejectBooking,
    getEarnings, getDashboard
};
