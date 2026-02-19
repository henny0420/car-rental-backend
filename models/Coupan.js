const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    code : {
        type : String,
        required : true,
        unique : true,
        uppercase : true,
        trim : true
    },
    discountType : {
        type : String,
        enum : ["fixed","percentage"],
        required : true
    },
    discountValue : {
        type : Number,
        required : true,
        default: 0

    },
    minBookingAmount : {
        type : Number,
        required : true
    },
    maxBookingAmount : {
        type : Number,
        required : true
    },
    expiryDate : {
        type : Date,
        required : true
    },
    usageLimit : {
        type : Number,
        required : true
    },
    isActive : {
        type : Boolean,
        default : true
    },
    usedCount : {
        type : Number,
        default : 0
    },
},{timestamps : true})

const coupanSchema = mongoose.model('coupans',UserSchema)
module.exports = coupanSchema