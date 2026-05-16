// // server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();

// // 🔹 UNIQUE CONSOLE LOGS FOR DEBUGGING
// console.log('🚀 [1] Server initialization started');

// // Middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true
// }));

// console.log('✅ [2] Middleware configured - CORS, JSON, CookieParser');


// // Import routes
// const authRoutes = require('./routes/authRoutes');

// // Routes
// console.log('🔵 [ROUTES] Registering routes...');
// app.use('/api/auth', authRoutes);

// // Database connection
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('✅ [DB-1] MongoDB connected successfully'))
//     .catch(err => console.log('❌ [DB-ERR] MongoDB connection failed:', err));

// // Test route
// app.get('/api/test', (req, res) => {
//     console.log('🔵 [ROUTE-HIT] /api/test called');
//     res.json({ message: 'Backend is working!' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`✅ [3] Server running on port ${PORT}`);
//     console.log(`🔗 [URL] http://localhost:${PORT}`);
// });

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
    origin: 'http://localhost:3000',  // Frontend URL
    credentials: true,                 // Allow cookies
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