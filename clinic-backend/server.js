const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// 1. Middlewares
app.use(cors());
app.use(bodyParser.json());

// 2. Connection to MongoDB (Local)
// لو عايزة تستخدمي Atlas غيري اللينك ده للينك بتاعهم
mongoose.connect('mongodb://127.0.0.1:27017/beautyClinicDB')
    .then(() => console.log('✅ Connected to MongoDB Successfully!'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// 3. Defining Schemas (هيكل البيانات)

// هيكل الحجوزات
const bookingSchema = new mongoose.Schema({
    name: String,
    phone: String,
    service: String,
    doctor: String,
    date: String,
    time: String,
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

// هيكل طلبات المنتجات
const orderSchema = new mongoose.Schema({
    customerName: String,
    phone: String,
    address: String,
    items: Array,
    totalAmount: Number,
    status: { type: String, default: 'Processing' }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
const Order = mongoose.model('Order', orderSchema);

// 4. APIs (العمليات)

// --- الحجوزات ---
// تسجيل حجز جديد
app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json({ message: "Booking confirmed in Database!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// جلب كل الحجوزات (عشان صفحة البروفايل والداشبورد)
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- الطلبات ---
// تسجيل طلب منتجات جديد
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// جلب كل الطلبات
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});