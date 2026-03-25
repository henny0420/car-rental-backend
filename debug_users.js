const mongoose = require('mongoose');
require('dotenv').config();

const fs = require('fs');

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const User = mongoose.model('Users', new mongoose.Schema({
            fullname: String,
            email: String,
            role: String
        }));

        const users = await User.find().lean();
        fs.writeFileSync('user_log.json', JSON.stringify(users, null, 2));
        console.log(`Log written to user_log.json (${users.length} users)`);

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkUsers();
