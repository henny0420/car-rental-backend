const DB = require('../../models');

const getDashboardStats = async function (req, res) {
    try {
        const totalUsers = await DB.USER.countDocuments({ role: 'user' });
        const totalOwners = await DB.USER.countDocuments({ role: 'owner' });
        const totalCars = await DB.CAR.countDocuments();
        const availableCars = await DB.CAR.countDocuments({ status: 'available' });

        const totalBookings = await DB.BOOKING.countDocuments();
        const completedBookings = await DB.BOOKING.countDocuments({ status: 'completed' });
        const ongoingBookings = await DB.BOOKING.countDocuments({ status: 'ongoing' });

        // Calculate total revenue from completed bookings
        const completedBookingsData = await DB.BOOKING.find({ status: 'completed', paymentStatus: 'paid' });
        const totalRevenue = completedBookingsData.reduce((acc, booking) => acc + (booking.finalPrice || 0), 0);

        return res.status(200).json({
            message: 'Dashboard stats fetched successfully',
            data: {
                users: {
                    totalUsers,
                    totalOwners
                },
                cars: {
                    totalCars,
                    availableCars
                },
                bookings: {
                    totalBookings,
                    completedBookings,
                    ongoingBookings
                },
                revenue: {
                    totalRevenue
                }
            },
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

module.exports = { getDashboardStats };
