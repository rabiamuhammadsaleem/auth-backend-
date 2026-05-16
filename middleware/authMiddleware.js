// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// console.log('🔵 [MIDDLEWARE] Auth middleware loaded');

// const protect = async (req, res, next) => {
//     console.log('🛡️ [AUTH-MID] Protecting route...');
    
//     let token;
    
//     // Get token from cookie
//     if (req.cookies.token) {
//         token = req.cookies.token;
//         console.log('🍪 [AUTH-MID] Token found in cookie');
//     }
    
//     if (!token) {
//         console.log('❌ [AUTH-MID] No token found');
//         return res.status(401).json({
//             success: false,
//             message: 'Not authorized, no token'
//         });
//     }
    
//     try {
//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log(`✅ [AUTH-MID] Token verified for user: ${decoded.id}`);
        
//         // Get user from database (exclude password)
//         const user = await User.findById(decoded.id).select('-password');
        
//         if (!user) {
//             console.log('❌ [AUTH-MID] User not found');
//             return res.status(401).json({
//                 success: false,
//                 message: 'User not found'
//             });
//         }
        
//         req.user = user;
//         console.log(`👤 [AUTH-MID] User attached to request: ${user.email}`);
//         next();
        
//     } catch (error) {
//         console.log('❌ [AUTH-MID] Token verification failed:', error.message);
//         return res.status(401).json({
//             success: false,
//             message: 'Not authorized, token failed'
//         });
//     }
// };

// module.exports = { protect };

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    console.log('🛡️ Protect middleware');
    console.log('🍪 Cookies received:', req.cookies);
    
    let token;
    
    // FIRST: Check cookie (primary method)
    if (req.cookies.token) {
        token = req.cookies.token;
        console.log('✅ Token found in cookie');
    }
    
    // SECOND: Check Authorization header (fallback)
    if (!token && req.headers.authorization) {
        if (req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            console.log('✅ Token found in Authorization header');
        }
    }
    
    if (!token) {
        console.log('❌ No token found');
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        
        console.log(`✅ User authenticated: ${req.user.email}`);
        next();
    } catch (error) {
        console.log('❌ Token verification failed:', error.message);
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }
};

module.exports = { protect };