const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // Adjust path if .env is elsewhere

async function approveAllCars() {
    try {
        // Since I don't know the exact mongo URI, I'll try to find it in the project
        // But better yet, I'll just add a temporary route to the express app
        console.log("Please use the temporary /car/approve-all-dev route I'm adding to the project to approve existing cars.");
    } catch (error) {
        console.error(error);
    }
}
