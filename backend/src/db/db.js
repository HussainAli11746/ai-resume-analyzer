const mongoose=require('mongoose');
require("dotenv").config();

const createDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected successfully');
};

module.exports = createDB;