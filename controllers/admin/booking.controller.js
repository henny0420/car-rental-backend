const DB = require('../../models');

const getAllBookings = async function (req, res) {
    try {
        const bookings = await DB.BOOKING.find()
            .populate('carId', 'name model registrationNumber')
            .populate('userId', 'fullname email')
            .populate('owner', 'fullname email');

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found', success: false });
        }

        return res.status(200).json({
            message: 'Bookings fetched successfully',
            data: bookings,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

const updateBookingStatus = async function (req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id) return res.status(400).json({ message: 'Booking ID is required', success: false });
        if (!status) return res.status(400).json({ message: 'Status is required', success: false });

        const updatedBooking = await DB.BOOKING.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedBooking) return res.status(404).json({ message: 'Booking not found', success: false });

        return res.status(200).json({
            message: 'Booking status updated successfully',
            data: updatedBooking,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

module.exports = { getAllBookings, updateBookingStatus };
