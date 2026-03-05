const mongoose = require('mongoose');

async function databaseConnection(){
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Database is connected');
    }
    catch(error){
        console.error("Database connection failed:", error.message);
        process.exit(1); // stop server if DB fails
    }
}

module.exports = databaseConnection;