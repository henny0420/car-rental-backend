const mongoose = require('mongoose')
const DB = require('../../models')

const getAllUsers = async function (req, res) {
    try {
        const allUsers = await DB.USER.find({
            role: { $eq: 'user' }
        })

        if (!allUsers) return res.status(400).json({
            message: "couldn't fetch users",
            success: false
        })

        return res.status(200).json({
            message: 'users fetched successfully',
            data: allUsers,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

const getAllOwners = async function (req, res) {
    try {
        const allOwners = await DB.USER.find({
            role: { $eq: 'owner' }
        });

        return res.status(200).json({
            message: 'owners fetched successfully',
            data: allOwners,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
}

const getUser = async function (req, res) {
    try {
        const { id } = req.params

        if (!id) return res.status(400).json({ message: 'id is not founded', success: false })

        const findUser = await DB.USER.findById(id)
        if (!findUser) return res.status(400).json({ message: 'user not found', success: false })

        return res.status(200).json({
            message: 'user fetched successfully',
            data: findUser,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}
const updateUserStatus = async function (req, res) {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        if (!id) return res.status(400).json({ message: 'User ID is required', success: false });

        const updatedUser = await DB.USER.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: 'User not found', success: false });

        return res.status(200).json({
            message: 'User status updated successfully',
            data: updatedUser,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

const deleteUser = async function (req, res) {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).json({ message: 'User ID is required', success: false });

        const deletedUser = await DB.USER.findByIdAndDelete(id);

        if (!deletedUser) return res.status(404).json({ message: 'User not found', success: false });

        return res.status(200).json({
            message: 'User deleted successfully',
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

module.exports = { getAllUsers, getAllOwners, getUser, updateUserStatus, deleteUser };