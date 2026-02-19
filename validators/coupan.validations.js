const joi = require('joi')

const addCoupanValidator = {
    body : joi.object({
        code : joi.string().required(),
        discountType : joi.string().required(),
        discountValue : joi.number,
        minBookingAmount : joi.number().required(),
        maxBookingAmount : joi.number().required(),
        expiryDate : joi.date().required(),
        usageLimit : joi.number().required(),
    })
}

module.exports = {addCoupanValidator}