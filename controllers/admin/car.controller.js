const DB = require('../../models');

const getAllCars = async function (req, res) {
    try {
        const cars = await DB.CAR.find().populate('brand').populate('createdBy', 'fullname email');

        if (!cars || cars.length === 0) {
            return res.status(404).json({ message: 'No cars found', success: false });
        }

        return res.status(200).json({
            message: 'Cars fetched successfully',
            data: cars,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

const getPendingCars = async function (req, res) {
    try {
        const cars = await DB.CAR.find({ approvalStatus: 'pending' }).populate('brand').populate('createdBy', 'fullname email role');
        console.log(`Found ${cars.length} pending cars`);

        return res.status(200).json({
            message: 'Pending cars fetched successfully',
            data: cars,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

const approveCar = async function (req, res) {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).json({ message: 'Car ID is required', success: false });

        const updatedCar = await DB.CAR.findByIdAndUpdate(
            id,
            { approvalStatus: 'approved', isActive: true, status: 'available' },
            { new: true }
        );

        if (!updatedCar) return res.status(404).json({ message: 'Car not found', success: false });

        // Update the user's role to owner if they aren't already an admin or owner
        if (updatedCar.createdBy) {
            const user = await DB.USER.findById(updatedCar.createdBy);
            if (user && user.role === 'user') {
                user.role = 'owner';
                await user.save();
            }

            // Create a notification for the user
            await DB.NOTIFICATION.create({
                recipient: updatedCar.createdBy,
                title: 'Car Approved!',
                message: `Your car "${updatedCar.name}" has been approved. You are now recognized as an Owner.`,
                type: 'approval',
                relatedId: updatedCar._id,
                onModel: 'cars'
            });
        }

        return res.status(200).json({
            message: 'Car approved successfully and user role updated',
            data: updatedCar,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

const updateCarStatus = async function (req, res) {
    try {
        const { id } = req.params;
        const { status, isActive, approvalStatus } = req.body;

        if (!id) return res.status(400).json({ message: 'Car ID is required', success: false });

        const updateData = {};
        if (status) updateData.status = status;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (approvalStatus) updateData.approvalStatus = approvalStatus;

        const updatedCar = await DB.CAR.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedCar) return res.status(404).json({ message: 'Car not found', success: false });
 
        // Notify user if rejected
        if (approvalStatus === 'rejected') {
            await DB.NOTIFICATION.create({
                recipient: updatedCar.createdBy,
                title: 'Car Submission Rejected',
                message: `Unfortunately, your car "${updatedCar.name}" was not approved for listing at this time.`,
                type: 'rejection',
                relatedId: updatedCar._id,
                onModel: 'cars'
            });
        }

        return res.status(200).json({
            message: 'Car status updated successfully',
            data: updatedCar,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

module.exports = { getAllCars, getPendingCars, approveCar, updateCarStatus };
