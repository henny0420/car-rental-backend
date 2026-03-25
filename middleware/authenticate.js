const jwt = require('jsonwebtoken')
const DB = require('./../models')
const secret = process.env.SECRET_KEY

const authenticateUser = async function (req, res, next) {
    try {
        const token = req.headers.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

        if (!token) {
            return res.status(400).json({
                message: "login first"
            })
        }

        jwt.verify(token, secret, (err, payload) => {
            if (err) return res.status(403).json({ message: "invalid token" })

            req.user = payload
            next()
        })

    }
    catch {
        return res.status(400).json({
            message: "internal server error"
        })
    }
}

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user ? req.user.role : 'undefined'} is not authorized to access this route`,
                success: false
            });
        }
        next();
    };
};

module.exports = {
    authenticateUser,
    authorize
}