

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

console.log('🚀 Server starting...');

// MIDDLEWARE - Ye order important hai
app.use(express.json());
app.use(cookieParser());

// CORS - CRUCIAL for cookies
app.use(cors({
    origin: ['http://localhost:3000','https://auth-frontend-steel.vercel.app/dashboard/api/auth'],  // Frontend URL
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                // Allow cookies
    allowedHeaders: ['Content-Type', 'Authorization']
}));

console.log('✅ Middleware configured with CORS credentials: true');

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Test route
app.get('/api/test', (req, res) => {
    console.log('Test route hit');
    res.json({ message: 'Backend is working!' });
});

// Database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.log('❌ DB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});