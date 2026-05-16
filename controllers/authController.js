// const User = require('../models/User');
// const jwt = require('jsonwebtoken');

// console.log('🔵 [CONTROLLER] Auth controller loaded');

// // Generate JWT Token
// const generateToken = (userId) => {
//     console.log(`🔑 [TOKEN] Generating token for user: ${userId}`);
//     return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
//         expiresIn: '7d'
//     });
// };

// // @desc    Register user
// // @route   POST /api/auth/signup
// // @access  Public
// const signup = async (req, res) => {
//     console.log('📝 [SIGNUP] Signup request received');
//     console.log('📦 [SIGNUP] Request body:', req.body);
    
//     try {
//         const { name, email, password } = req.body;
        
//         // Validation
//         if (!name || !email || !password) {
//             console.log('❌ [SIGNUP] Missing fields');
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'Please provide name, email and password' 
//             });
//         }
        
//         if (password.length < 6) {
//             console.log('❌ [SIGNUP] Password too short');
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'Password must be at least 6 characters' 
//             });
//         }
        
//         // Check if user already exists
//         console.log(`🔍 [SIGNUP] Checking if email exists: ${email}`);
//         const existingUser = await User.findOne({ email });
        
//         if (existingUser) {
//             console.log('❌ [SIGNUP] User already exists');
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'User already exists with this email' 
//             });
//         }
        
//         // Create user
//         console.log('👤 [SIGNUP] Creating new user...');
//         const user = await User.create({
//             name,
//             email,
//             password
//         });
        
//         console.log('✅ [SIGNUP] User created successfully:', user._id);
        
//         // Generate token
//         const token = generateToken(user._id);
        
//         // Set cookie
//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'lax',
//             maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
//         });
        
//         console.log('🍪 [SIGNUP] Cookie set with token');
        
//         // Send response
//         res.status(201).json({
//             success: true,
//             message: 'User registered successfully',
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email
//             }
//         });
        
//     } catch (error) {
//         console.log('🔥 [SIGNUP] Error:', error.message);
//         res.status(500).json({ 
//             success: false, 
//             message: 'Server error', 
//             error: error.message 
//         });
//     }
// };

// // @desc    Login user
// // @route   POST /api/auth/login
// // @access  Public
// const login = async (req, res) => {
//     console.log('🔐 [LOGIN] Login request received');
//     console.log('📦 [LOGIN] Request body:', req.body);
    
//     try {
//         const { email, password } = req.body;
        
//         // Validation
//         if (!email || !password) {
//             console.log('❌ [LOGIN] Missing email or password');
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'Please provide email and password' 
//             });
//         }
        
//         // Check if user exists
//         console.log(`🔍 [LOGIN] Finding user: ${email}`);
//         const user = await User.findOne({ email });
        
//         if (!user) {
//             console.log('❌ [LOGIN] User not found');
//             return res.status(401).json({ 
//                 success: false, 
//                 message: 'Invalid credentials' 
//             });
//         }
        
//         // Check password
//         console.log(`🔐 [LOGIN] Verifying password for: ${email}`);
//         const isPasswordMatch = await user.comparePassword(password);
        
//         if (!isPasswordMatch) {
//             console.log('❌ [LOGIN] Password mismatch');
//             return res.status(401).json({ 
//                 success: false, 
//                 message: 'Invalid credentials' 
//             });
//         }
        
//         console.log('✅ [LOGIN] Password verified successfully');
        
//         // Generate token
//         const token = generateToken(user._id);
        
//         // Set cookie
//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'lax',
//             maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
//         });
        
//         console.log('🍪 [LOGIN] Cookie set with token');
        
//         // Send response
//         res.status(200).json({
//             success: true,
//             message: 'Login successful',
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email
//             }
//         });
        
//     } catch (error) {
//         console.log('🔥 [LOGIN] Error:', error.message);
//         res.status(500).json({ 
//             success: false, 
//             message: 'Server error', 
//             error: error.message 
//         });
//     }
// };

// module.exports = { signup, login };


const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

// SIGNUP
const signup = async (req, res) => {
    console.log('📝 Signup:', req.body);
    
    try {
        const { name, email, password } = req.body;
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = await User.create({ name, email, password: hashedPassword });
        
        const token = generateToken(user._id);
        
        // COOKIE SETTING - IMPORTANT
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,           // false for localhost (http)
            sameSite: 'lax',         // Allow cross-site
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'                // Cookie available on all routes
        });
        
        console.log('🍪 Cookie set with flags: httpOnly=true, secure=false, sameSite=lax');
        
        res.status(201).json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email }
        });
        
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// LOGIN
const login = async (req, res) => {
    console.log('🔐 Login:', req.body.email);
    
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const token = generateToken(user._id);
        
        // COOKIE SETTING - SAME AS SIGNUP
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,           // false for localhost
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });
        
        console.log('🍪 Login cookie set');
        
        res.json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email }
        });
        
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// GET ME - Protected
const getMe = async (req, res) => {
    console.log('👤 GetMe called, user:', req.user?.email);
    
    try {
        res.json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                createdAt: req.user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// LOGOUT
const logout = async (req, res) => {
    console.log('🚪 Logout');
    
    // Clear cookie
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/'
    });
    
    res.json({ success: true, message: 'Logged out' });
};

module.exports = { signup, login, getMe, logout };



// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// console.log('🔵 [CONTROLLER] Auth controller loaded');

// // Generate JWT Token
// const generateToken = (userId) => {
//     console.log(`🔑 [TOKEN] Generating token for user: ${userId}`);
//     return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
//         expiresIn: '7d'
//     });
// };

// // @desc    Register user
// // @route   POST /api/auth/signup
// // @access  Public
// const signup = async (req, res) => {
//     console.log('📝 [SIGNUP] Signup request received');
//     console.log('📦 [SIGNUP] Request body:', req.body);
    
//     try {
//         const { name, email, password } = req.body;
        
//         // Validation
//         if (!name || !email || !password) {
//             console.log('❌ [SIGNUP] Missing fields');
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'Please provide name, email and password' 
//             });
//         }
        
//         if (password.length < 6) {
//             console.log('❌ [SIGNUP] Password too short');
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'Password must be at least 6 characters' 
//             });
//         }
        
//         // Check if user already exists
//         console.log(`🔍 [SIGNUP] Checking if email exists: ${email}`);
//         const existingUser = await User.findOne({ email });
        
//         if (existingUser) {
//             console.log('❌ [SIGNUP] User already exists');
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'User already exists with this email' 
//             });
//         }
        
//         // Hash password manually
//         console.log('🔐 [SIGNUP] Hashing password...');
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);
//         console.log('✅ [SIGNUP] Password hashed successfully');
        
//         // Create user
//         console.log('👤 [SIGNUP] Creating new user...');
//         const user = await User.create({
//             name,
//             email,
//             password: hashedPassword
//         });
        
//         console.log('✅ [SIGNUP] User created successfully:', user._id);
        
//         // Generate token
//         const token = generateToken(user._id);
        
//         // Set cookie
//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'lax',
//             maxAge: 7 * 24 * 60 * 60 * 1000
//         });
        
//         console.log('🍪 [SIGNUP] Cookie set with token');
        
//         // Send response
//         res.status(201).json({
//             success: true,
//             message: 'User registered successfully',
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email
//             }
//         });
        
//     } catch (error) {
//         console.log('🔥 [SIGNUP] Error:', error.message);
//         res.status(500).json({ 
//             success: false, 
//             message: 'Server error', 
//             error: error.message 
//         });
//     }
// };

// // @desc    Login user
// // @route   POST /api/auth/login
// // @access  Public
// const login = async (req, res) => {
//     console.log('🔐 [LOGIN] Login request received');
//     console.log('📦 [LOGIN] Request body:', req.body);
    
//     try {
//         const { email, password } = req.body;
        
//         if (!email || !password) {
//             console.log('❌ [LOGIN] Missing email or password');
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'Please provide email and password' 
//             });
//         }
        
//         console.log(`🔍 [LOGIN] Finding user: ${email}`);
//         const user = await User.findOne({ email });
        
//         if (!user) {
//             console.log('❌ [LOGIN] User not found');
//             return res.status(401).json({ 
//                 success: false, 
//                 message: 'Invalid credentials' 
//             });
//         }
        
//         console.log(`🔐 [LOGIN] Verifying password for: ${email}`);
//         const isPasswordMatch = await bcrypt.compare(password, user.password);
        
//         if (!isPasswordMatch) {
//             console.log('❌ [LOGIN] Password mismatch');
//             return res.status(401).json({ 
//                 success: false, 
//                 message: 'Invalid credentials' 
//             });
//         }
        
//         console.log('✅ [LOGIN] Password verified successfully');
        
//         const token = generateToken(user._id);
        
//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'lax',
//             maxAge: 7 * 24 * 60 * 60 * 1000
//         });
        
//         console.log('🍪 [LOGIN] Cookie set with token');
        
//         res.status(200).json({
//             success: true,
//             message: 'Login successful',
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email
//             }
//         });
        
//     } catch (error) {
//         console.log('🔥 [LOGIN] Error:', error.message);
//         res.status(500).json({ 
//             success: false, 
//             message: 'Server error', 
//             error: error.message 
//         });
//     }
// };

// // @desc    Get current logged in user
// // @route   GET /api/auth/me
// // @access  Private
// const getMe = async (req, res) => {
//     console.log('👤 [GET-ME] Getting current user');
//     console.log(`📧 [GET-ME] User email: ${req.user.email}`);
    
//     try {
//         res.status(200).json({
//             success: true,
//             user: {
//                 id: req.user._id,
//                 name: req.user.name,
//                 email: req.user.email,
//                 createdAt: req.user.createdAt
//             }
//         });
//     } catch (error) {
//         console.log('❌ [GET-ME] Error:', error.message);
//         res.status(500).json({
//             success: false,
//             message: 'Server error'
//         });
//     }
// };

// // @desc    Logout user / Clear cookie
// // @route   POST /api/auth/logout
// // @access  Public
// const logout = async (req, res) => {
//     console.log('🚪 [LOGOUT] Logging out user');
    
//     try {
//         // Clear the cookie
//         res.cookie('token', '', {
//             httpOnly: true,
//             expires: new Date(0),
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'lax'
//         });
        
//         console.log('✅ [LOGOUT] Cookie cleared successfully');
        
//         res.status(200).json({
//             success: true,
//             message: 'Logged out successfully'
//         });
//     } catch (error) {
//         console.log('❌ [LOGOUT] Error:', error.message);
//         res.status(500).json({
//             success: false,
//             message: 'Server error'
//         });
//     }
// };

// module.exports = { signup, login, getMe, logout };