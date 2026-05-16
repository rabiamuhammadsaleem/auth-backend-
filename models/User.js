// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// console.log('🔵 [MODEL] User model file loaded');

// const UserSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, 'Name is required'],
//         trim: true
//     },
//     email: {
//         type: String,
//         required: [true, 'Email is required'],
//         unique: true,
//         lowercase: true,
//         trim: true
//     },
//     password: {
//         type: String,
//         required: [true, 'Password is required'],
//         minlength: 6
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// // Hash password before saving - SIMPLIFIED VERSION
// UserSchema.pre('save', function(next) {
//     console.log(`🔐 [MODEL-HASH] Hashing password for: ${this.email}`);
    
//     if (!this.isModified('password')) {
//         console.log('⚠️ [MODEL-HASH] Password not modified, skipping hash');
//         return next();
//     }
    
//     bcrypt.genSalt(10, (err, salt) => {
//         if (err) {
//             console.log('❌ [MODEL-HASH] Salt generation error:', err);
//             return next(err);
//         }
        
//         bcrypt.hash(this.password, salt, (err, hash) => {
//             if (err) {
//                 console.log('❌ [MODEL-HASH] Hash generation error:', err);
//                 return next(err);
//             }
//             this.password = hash;
//             console.log('✅ [MODEL-HASH] Password hashed successfully');
//             next();
//         });
//     });
// });

// // Method to compare password
// UserSchema.methods.comparePassword = async function(enteredPassword) {
//     console.log(`🔐 [MODEL-COMPARE] Comparing password for: ${this.email}`);
//     return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');

console.log('🔵 [MODEL] User model file loaded');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);