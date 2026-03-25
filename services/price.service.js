const DB = require('../models')
const mongoose = require('mongoose')

const priceCalculate = async ({carId, bookingDate, endingDate, couponCode }) =>{
        const start= new Date(bookingDate)
        const end = new Date(endingDate)

        if(start > end) return ({
            message : "invalid dates"
        })

        const totalDays = Math.ceil((new Date(endingDate) - new Date(bookingDate)) / (1000 * 60 * 60 * 24))
       

        const car = await DB.CAR.findById(carId).lean()

        if(!car) return ({
            message : "car not found"
        })

        const carPrice = car.pricePerDay || car.pricePerHour || 0;
        const totalRent = totalDays * carPrice;

        let discountAmount = 0;
        let appliedCouponId = null;

        if(couponCode) {
            const coupon = await DB.COUPAN.findOne({code : couponCode})

            if(!coupon) return {
                message : "coupan not found"
            }

            if(coupon.discountType == 'fixed') {
                discountAmount = coupon.discountValue
            } else {
                discountAmount = (coupon.discountValue/100) * totalRent
            }
            
            appliedCouponId = coupon._id
        }
            
        const finalPrice = Math.max(Math.floor(totalRent - discountAmount), 0);
       
        
        return {
            totalDays,
            totalRent,
            finalPrice,
            discountAmount,
            couponId: appliedCouponId,
            couponCode: couponCode || null
        };

}

module.exports = {
    priceCalculate
}