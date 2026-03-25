const mongoose = require('mongoose');
require('dotenv').config();

const fs = require('fs');

async function checkPending() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Car = mongoose.model('cars', new mongoose.Schema({
            name: String,
            approvalStatus: String,
            createdAt: Date
        }));

        const cars = await Car.find().sort({ createdAt: -1 }).lean();
        fs.writeFileSync('db_log.json', JSON.stringify(cars, null, 2));
        console.log(`Log written to db_log.json (${cars.length} cars)`);

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkPending();
