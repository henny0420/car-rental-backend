const mongoose = require('mongoose');
require('dotenv').config();

async function checkBrands() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Brand = mongoose.model('brands', new mongoose.Schema({
            name: String
        }));

        const brands = await Brand.find().lean();
        console.log("BRANDS IN DB:", JSON.stringify(brands, null, 2));

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkBrands();
