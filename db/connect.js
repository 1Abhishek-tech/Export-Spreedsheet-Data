const mongoose = require('mongoose')

const connectDB = () => {
    return mongoose.connect("mongodb+srv://abhi:abhi@cluster0.j11pqp5.mongodb.net/?retryWrites=true&w=majority", {
    })
}

module.exports = connectDB;