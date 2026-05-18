// // const express = require('express');
// // const { signup, login, getMe, logout } = require('../controllers/authController');
// // const { protect } = require('../middleware/authMiddleware');
// // console.log('🔵 [ROUTES] Auth routes loaded');

// // const router = express.Router();

// // router.get('/check', (req, res) => {
// //     console.log('🔵 [CHECK-ROUTE] This works!');
// //     res.json({ message: 'Route is working!' });
// // });

// // // Test route
// // router.get('/test', (req, res) => {
// //     console.log('🔵 [ROUTE-TEST] Auth test route hit');
// //     res.json({ message: 'Auth routes working!' });
// // });

// // // Signup route
// // router.post('/signup', signup);

// // // Login route
// // router.post('/login', login);

// // // Get current user route
// // router.get('/me', protect, getMe);

// // // Logout route
// // router.post('/logout', logout);


// // module.exports = router;


// const express = require('express');
// const { signup, login, getMe, logout } = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware');

// const router = express.Router();

// // Public
// router.post('/signup', signup);
// router.post('/login', login);
// router.post('/logout', logout);

// // Protected
// // router.get('/me', protect, getMe);

// // Test
// router.get('/test', (req, res) => {
//     res.json({ message: 'Auth route working!' });
// });

// module.exports = router;

const express = require('express');
const { signup, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Protected route - IMPORTANT: UNCOMMENT THIS
router.get('/me', protect, getMe);

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Auth route working!' });
});

module.exports = router;