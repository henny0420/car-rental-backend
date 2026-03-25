const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookingSchema = new Schema({
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cars',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookingDate: {
        type: Date,
        required: true
    },
    endingDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'booked','approved', 'cancelled', 'completed', 'ongoing'],
        default: 'pending'
    },
    couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
        default: null
    },

    couponCode: String,
    discountAmount: Number,
    finalPrice: Number,
    totalDays: Number,
    baseAmount: Number,

    transactionId: {
        type: String
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'refunded'],
        default: 'unpaid'
    },
})

const Booking = mongoose.model('bookings', bookingSchema)
module.exports = Booking