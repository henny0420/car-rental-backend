const mongoose = require('mongoose');
const Schema = mongoose.Schema
const objId = mongoose.Schema.Types.ObjectId

const CarSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    brand:{
        type:objId,
        ref :'brands',
        required:true,
    },
    model : {
        type : String,
        required:true
    },
    carType : {
        type :String,
        enum :['sedan','suv','sports car','jeep','van','convertible','hatchback'],
        required :true
    },
    features: {
        color: String,
        transmission: {
            type: String,
            enum: ['Manual', 'Automatic'],
            required: true
        },
        fuelType: {
            type: String,
            required: true,
            enum: ['petrol', 'diesel', 'hybrid', 'ev', 'cng'],
        },
        seatingCapacity:{
            type : Number,
            required :true
        },
        hasAC: Boolean,
        hasGPS: Boolean,
        bluetooth: Boolean
    },
    pricePerHour :{
        type :Number,
        min: 0,
        required :true
    },
    status: {
        type: String,
        enum: ['available', 'booked', 'maintenance'],
        default: 'available'
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    documents: {
        insuranceValidTill: Date,
        pollutionValidTill: Date
    },
    rating: {
        avg: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    coverImage: { 
        url: {
            type: String,
            required: true
    },
        public_id: {
            type: String,
            required: true
    }},
   galleryImages: {
        type: [
            {
            url: {
                type: String,
                required: true
            },
            public_id: {
                type: String,
                required: true
            }
            }
        ],
         default: []
},

    // image: [ {
    //     url: {
    //         type: String,
    //         required: true
    // },
    //     public_id: {
    //         type: String,
    //         required: true
    // }}],
    location: {
        city: {
            type: String,
            required: true
        } 
    },
    isActive : {
        type : Boolean,
        default : true,
        required : true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
},{timestamps : true})

const Car =mongoose.model('cars',CarSchema)
module.exports = Car