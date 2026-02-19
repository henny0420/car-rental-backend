const mongoose = require('mongoose')
const DB = require('./../models')

const createBooking = async function(req,res) {
    try{
       const{carId,
            bookingDate,
            endingDate,
            couponCode} = req.body 
            
            const userId = req.user._id
            
            if (!carId || !bookingDate || !endingDate) {
                return res.status(400).json({
                    message : "all fields are required"    
                })
            }
            
            const start = new Date(bookingDate)
            const end = new Date(endingDate)

            // 1. Fetch the car to get the owner ID
            const car = await DB.CAR.findById(carId)
            if (!car) return res.status(404).json({ message: "Car not found" })
            
            const findBooking = await DB.BOOKING.find({
                carId,
                // 2. Fix overlap logic: (ExistingStart < NewEnd) AND (ExistingEnd > NewStart)
                bookingDate: { $lt: end },
                endingDate: { $gt: start }
            })

    if(findBooking.length > 0){
        return res.json({
            message : "car is already booked"
        })
    }

        const newBooking = await DB.BOOKING.create({
            carId,
            userId,
            owner: car.createdBy, // 3. Add the required owner field
            bookingDate,
            endingDate,
            couponCode
        })
        console.log(newBooking);
        
        return res.status(201).json({
            message : "booking created successfully",
            newBooking
        })
}
    catch(error){
        console.log("Booking Error:", error); // 4. Log the actual error
        return res.status(500).json({
            message : "internal server error"
        })
    }
}

module.exports = {
    createBooking
}