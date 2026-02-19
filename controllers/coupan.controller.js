const DB = require('./../models')

const addCoupan = async function (req, res) {
    try {
        const { code, discountType, discountValue, minBookingAmount, maxBookingAmount, expiryDate, usageLimit } = req.body

        const existingCoupan = await DB.USER.findOne({ code })
        if (existingCoupan) {
            return res.json({
                success: false,
                Message: "Coupan already exists"
            })
        }
        const newCoupan = await DB.USER.create({
            code,
            discountType,
            discountValue,
            minBookingAmount,
            maxBookingAmount,
            expiryDate,
            usageLimit
        })

        return res.status(201).json({
            success: true,
            message: "Coupan added successfully",
            newCoupan
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message : "internal server error",
            error: error.message
        })
    
    }
}

const getAllCoupan = async function(req,res) {
    try{
        const coupan = await DB.USER.find()
        if(!coupan){
            return res.status(400).json({
                message : "coupan not found"
                })
        }
        else{
            return res.status(200).json({
                message : "coupan found",
                coupan
            })
        }

    }
    catch(error) {
        return res.status(400).json({
            message : "internal server error"
        })

    }
}

const updateCoupan = async function(req,res){
    try{
        const {id} = req.params
        const {code,discountType,discountValue,minBookingAmount,maxBookingAmount,expiryDate,usageLimit} = req.body

        const updateCoupan = await DB.USER.findByIdAndUpdate(id,{
            code,discountType,discountValue,minBookingAmount,maxBookingAmount,expiryDate,usageLimit
        },{new : true})

        return res.status(200).json({
            message : "coupan updated successfully",
            updateCoupan
        })
    }
    catch(error){
       return res.status(400).json({
            message : "internal server error"
        })
    }
}

const deleteCoupan = async function(req,res){
    try{
        const {id} = req.params
        if(!id) return res.status(400).json({
            message : "id is required"
        })

        const deleteCoupan = await DB.USER.findByIdAndDelete(id)        
    }
    catch(error){
        return res.status(400).json({
            message : "internal server error"
        })
    }}

module.exports = {
    addCoupan,
    getAllCoupan,
    updateCoupan,
    deleteCoupan
}