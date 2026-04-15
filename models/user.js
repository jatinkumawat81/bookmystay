const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        lowercase: true,
        validate: [validator.isAlpha, 'First name must contain only letters']
    },
    lastName: {
        type: String,
        trim: true,
        lowercase: true,
        validate: [validator.isAlpha, 'Last name must contain only letters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    },
    confirmPassword: {
        type: String,
        required: [true, 'Confirm password is required'],
    }
}, { timestamps: true });

const user = mongoose.model('User', userSchema);

module.exports = user;