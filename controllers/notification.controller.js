const DB = require('../models');

const getAdminNotifications = async (req, res) => {
    try {
        const notifications = await DB.NOTIFICATION.find({ recipient: 'admin' })
            .sort({ createdAt: -1 })
            .limit(50);
        
        return res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getUnreadCount = async (req, res) => {
    try {
        const count = await DB.NOTIFICATION.countDocuments({ recipient: 'admin', isRead: false });
        const pendingCars = await DB.CAR.countDocuments({ approvalStatus: 'pending' });
        
        return res.status(200).json({
            success: true,
            unreadCount: count,
            pendingCarsCount: pendingCars
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await DB.NOTIFICATION.findByIdAndUpdate(id, { isRead: true });
        return res.status(200).json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        await DB.NOTIFICATION.updateMany({ recipient: 'admin', isRead: false }, { isRead: true });
        return res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
 
const getUserNotifications = async (req, res) => {
    try {
        const notifications = await DB.NOTIFICATION.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20);
        
        return res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
 
const markUserNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await DB.NOTIFICATION.findOneAndUpdate(
            { _id: id, recipient: req.user._id },
            { isRead: true },
            { new: true }
        );
        if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
        return res.status(200).json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAdminNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    getUserNotifications,
    markUserNotificationAsRead
};
