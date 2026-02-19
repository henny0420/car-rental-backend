const jwt = require('jsonwebtoken')
const DB = require('./../models')
const secret = process.env.SECRET_KEY

const authenticateUser = async function(req,res,next){
    try{
       const token = req.headers.token 
       
       if(!token){
           return res.status(400).json({
               message : "login first"
            })
        }
        
        jwt.verify(token,secret ,(err , payload) => {
            if(err) return res.status(403).json({message  : "invalid token"})
                
                req.user = payload
            next()
       })

    }
    catch{
        return res.status(400).json({
            message : "internal server error"
        })
    }
}

module.exports = {
    authenticateUser
}