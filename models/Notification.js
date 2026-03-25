const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    recipient: {
        type: String, // 'admin' or userId
        required: true,
        default: 'admin'
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['car_submission', 'booking', 'system', 'approval', 'rejection'],
        default: 'car_submission'
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        enum: ['cars', 'bookings']
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Notification = mongoose.model('notifications', NotificationSchema);
module.exports = Notification;
