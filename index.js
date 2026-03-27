require('dotenv').config();
const express = require('express')
const app = express()
var cors = require('cors')
const port = 4000
var jwt = require('jsonwebtoken');
const ConnectDB = require('./db/dbConnection');
const { error } = require('console');
const ROUTES = require('./routes')
const multer = require("multer");


ConnectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)

        })
    }).catch(() => {
        console.error("error : ", error)
    })

app.use(express.json())
app.use(cors({
    origin: '*',
    credentials: true,
}))

app.get('/', (req, res) => {
    res.json({ message: "Car Rental API is running", status: "OK" });
})

app.use('/', ROUTES.USER)

app.use('/role', ROUTES.ROLE)

app.use('/brand', ROUTES.BRAND)

app.use('/car', ROUTES.CAR)

app.use('/coupan', ROUTES.COUPAN)

app.use('/', ROUTES.BOOKING)

app.use('/admin', ROUTES.ADMIN)

app.use('/booking',ROUTES.BOOKING)

app.use('/owner', require('./routes/owner.routes'))
app.use('/notification', require('./routes/notification.route'))
 
// Global Error Handler
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, message: 'File is too large (Max 25MB)' });
        }
        return res.status(400).json({ success: false, message: err.message });
    }
    return res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});
