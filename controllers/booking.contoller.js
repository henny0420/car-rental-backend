const mongoose = require('mongoose')
const DB = require('./../models')
const { priceCalculate } = require('../services/price.service')

const createBooking = async function (req, res) {
    try {
        const { carId,
            bookingDate,
            endingDate,
            couponCode
        } = req.body

        const userId = req.user._id

        if (!carId || !bookingDate || !endingDate) {
            return res.status(400).json({
                message: "all fields are required"
            })
        }

        const start = new Date(bookingDate)
        const end = new Date(endingDate)

        const car = await DB.CAR.findById(carId)
        if (!car) return res.status(404).json({ message: "Car not found" })

        const findBooking = await DB.BOOKING.find({
            carId,
            bookingDate: { $lt: end },
            endingDate: { $gt: start },
            status: { $ne: "cancelled" }
        })

        if (findBooking.length > 0) {
            return res.json({
                message: "car is already booked"
            })
        }

        const priceData = await priceCalculate({
            carId: car._id,
            bookingDate: start,
            endingDate: end,
            couponCode,
            userId
        });

        const newBooking = await DB.BOOKING.create({
            carId,
            userId,
            owner: car.createdBy,
            bookingDate,
            endingDate,
            totalDays: priceData.totalDays,
            baseAmount: priceData.totalRent,
            discountAmount: priceData.discountAmount,
            finalPrice: priceData.finalPrice,
            couponCode: couponCode || null,
            couponId: priceData.couponId || null,
            paymentStatus: "unpaid",
            transactionId: null,
            status: "booked",
        })
        console.log("New Booking:", newBooking);

        return res.status(201).json({
            message: "booking created successfully",
            newBooking
        })
    }
    catch (error) {
        console.log("Booking Error:", error); // 4. Log the actual error
        return res.status(500).json({
            message: "internal server error"
        })
    }
}

const cancelBooking = async function (req, res) {
    try {
        const { id } = req.params

        if (!id) return res.status(400).json({
            message: "id is required"
        })

        const booking = await DB.BOOKING.findById(id)
        if (!booking) return res.status(400).json({
            message: "booking not found"
        })

        const cancel = await DB.BOOKING.findByIdAndUpdate(id, {
            status: "cancelled"
        }, { new: true })


        return res.status(200).json({
            message: "booking cancelled successfully",
            cancel
        })
    } catch (error) {
        return res.status(500).json({
            message: "internal server error"
        })
    }
}

const getMyBookings = async function (req, res) {
    try {
        const userId = req.user._id

        const bookings = await DB.BOOKING.find({ userId })
            .populate({
                path: 'carId',
                populate: { path: 'brand' }
            })
            .sort({ bookingDate: -1 })

        return res.status(200).json({
            message: "bookings fetched successfully",
            bookings
        })
    } catch (error) {
        console.log("Fetch Bookings Error:", error);
        return res.status(500).json({
            message: "internal server error"
        })
    }
}

module.exports = {
    createBooking,
    cancelBooking,
    getMyBookings
}