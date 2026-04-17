const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
        unique: [true, 'Email already exists'],
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
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords & confirm password do not match'
        }
    }
}, { timestamps: true });

userSchema.pre('save', async function(){
    //skip hashing if password is not modified
    if(!this.isModified('password')) return;
    // const salt = bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = undefined;
});

const user = mongoose.model('User', userSchema);

module.exports = user;