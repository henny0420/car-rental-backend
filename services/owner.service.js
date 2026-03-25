const DB = require('../models');

class OwnerService {
    // ---- Car Management ----
    async createCar(carData, ownerId) {
        // Logic might already exist in main car logic, this is specifically for owner
        carData.createdBy = ownerId;
        const newCar = await DB.CAR.create(carData);
        return newCar;
    }

    async getMyCars(ownerId) {
        return await DB.CAR.find({ createdBy: ownerId }).populate('brand');
    }

    async getCarById(id, ownerId) {
        return await DB.CAR.findOne({ _id: id, createdBy: ownerId }).populate('brand');
    }

    async updateCar(id, updateData, ownerId) {
        return await DB.CAR.findOneAndUpdate(
            { _id: id, createdBy: ownerId },
            updateData,
            { new: true }
        );
    }

    async deleteCar(id, ownerId) {
        return await DB.CAR.findOneAndDelete({ _id: id, createdBy: ownerId });
    }

    async updateCarStatus(id, status, ownerId) {
        return await DB.CAR.findOneAndUpdate(
            { _id: id, createdBy: ownerId },
            { status },
            { new: true }
        );
    }

    // ---- Booking Management ----
    async getMyBookings(ownerId) {
        return await DB.BOOKING.find({ owner: ownerId })
            .populate('carId', 'name model registrationNumber status pricePerHour coverImage')
            .populate('userId', 'fullname email');
    }

    async getBookingById(id, ownerId) {
        return await DB.BOOKING.findOne({ _id: id, owner: ownerId })
            .populate('carId')
            .populate('userId', 'fullname email');
    }

    async updateBookingStatus(id, newStatus, ownerId) {
        return await DB.BOOKING.findOneAndUpdate(
            { _id: id, owner: ownerId },
            { status: newStatus },
            { new: true }
        );
    }

    // ---- Dashboard and Earnings ----
    async getEarnings(ownerId) {
        const completedBookings = await DB.BOOKING.find({ owner: ownerId, status: 'completed' });
        const totalRevenue = completedBookings.reduce((acc, booking) => acc + (booking.finalPrice || 0), 0);
        return totalRevenue;
    }

    async getDashboardStats(ownerId) {
        const totalCars = await DB.CAR.countDocuments({ createdBy: ownerId });
        const totalBookings = await DB.BOOKING.countDocuments({ owner: ownerId });
        const activeBookings = await DB.BOOKING.countDocuments({
            owner: ownerId,
            status: { $in: ['approved', 'ongoing'] }
        });
        const totalRevenue = await this.getEarnings(ownerId);

        return {
            totalCars,
            totalBookings,
            activeBookings,
            totalRevenue
        };
    }
}

module.exports = new OwnerService();
