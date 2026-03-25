require('dotenv').config();
const mongoose = require('mongoose');
const DB = require('./models');
const ConnectDB = require('./db/dbConnection');

async function checkCars() {
    try {
        await ConnectDB();
        const cars = await DB.CAR.find({}, 'name approvalStatus isActive').lean();
        console.log("CAR DB STATUS:");
        cars.forEach(c => {
            console.log(`- ${c.name}: status=${c.approvalStatus}, active=${c.isActive}`);
        });
        const pendingCount = await DB.CAR.countDocuments({ approvalStatus: 'pending' });
        console.log("PENDING COUNT:", pendingCount);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkCars();
