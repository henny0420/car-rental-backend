const jwt = require('jsonwebtoken')
const DB= require('../models')
const secret = process.env.SECRET_KEY

const routeAccess = (isTokenRequired = true , userAllowed = []) => {
    return async(req,res,next) => {
        const token = req.headers.token
        if(!token) return res.json({
            message :'token not provided',
            status :400,
            success : false
        })

        const verify_user= await jwt.verify(token,secret)
        
        const user = await DB.USER.findById(verify_user._id)
        const allow_user = userAllowed.find((role)=> role=== user.role)
        
        if(allow_user){
            req.user = user;
            next()
        }else{
                return res.json({
                    message: 'unauthorized access'
                })
        }
        
    }
}

module.exports = {routeAccess }