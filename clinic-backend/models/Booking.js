const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: String,
    phone: String,
    service: String,
    doctor: String,
    date: String,
    time: String,
    status: { type: String, default: "Pending" } // حالة افتراضية
});

module.exports = mongoose.model('Booking', bookingSchema);