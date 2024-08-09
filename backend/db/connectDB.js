const mongoose = require("mongoose")

const connectDB = () => {
    return mongoose.connect(process.env.MONGO_COMPASS_URL)
            .then(() => console.log('ADMIN CONNECT TO THE DATABASE SUCCESSFULLY'))
            .catch((err)=> console.log('FAILED WHILE CONNECT TO THE DATABASE'))
}   

module.exports = connectDB