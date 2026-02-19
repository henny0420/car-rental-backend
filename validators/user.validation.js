const joi = require('joi')

const passwordRegex = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
const signupValidator = {
    body : joi.object({
        fullname :joi.string().min(3).required(),
        password : joi.string().min(6).pattern(passwordRegex).required(),
        email : joi.string().min(6).required()
    })
}

const signinValidator = {
     body : joi.object({
        password : joi.string().min(6).required(),
        email : joi.string().min(6).required()
    })
}

module.exports = {signupValidator,signinValidator}