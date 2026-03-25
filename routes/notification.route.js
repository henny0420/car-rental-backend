const express = require('express');
const router = express.Router();
const CONTROLLER = require('../controllers');
const auth = require('../middleware/authenticate');
const { routeAccess } = require('../middleware/routeAccess');

router.get('/admin/all', 
    routeAccess(true, ['admin']), 
    CONTROLLER.NOTIFICATION.getAdminNotifications
);

router.get('/admin/unread-count', 
    routeAccess(true, ['admin']), 
    CONTROLLER.NOTIFICATION.getUnreadCount
);

router.put('/admin/mark-read/:id', 
    routeAccess(true, ['admin']), 
    CONTROLLER.NOTIFICATION.markAsRead
);

router.put('/admin/mark-all-read', 
    routeAccess(true, ['admin']), 
    CONTROLLER.NOTIFICATION.markAllAsRead
);
 
// ---- User (Owner/User) Routes ----
router.get('/all', 
    auth.authenticateUser, 
    CONTROLLER.NOTIFICATION.getUserNotifications
);
 
router.put('/mark-read/:id', 
    auth.authenticateUser, 
    CONTROLLER.NOTIFICATION.markUserNotificationAsRead
);
 
router.put('/mark-all-read', 
    auth.authenticateUser, 
    async (req, res) => {
        try {
            const DB = require('../models');
            await DB.NOTIFICATION.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
            return res.status(200).json({ success: true, message: 'All notifications marked as read' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
);

module.exports = router;
