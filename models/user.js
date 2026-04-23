const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false
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
    },
    passwordChangedAt: Date,
    role: {
        type: String,
        enum: ['user', 'admin', 'super'],
        default: 'user'
    },
    resetToken: String,
    resetTokenExpiresAt: Date,
    isActive: {
        type: Boolean,
        default: true,
        select: false
    },
    bio: {
        type: String,
        maxlength: [1000, 'Bio must be less than 1000 characters']
    },
    address: {
        city: String,
        country: String
    },
    contact: {
         altEmail: {
            type: String,
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, 'Please provide a valid email']
        },
        code: {
            type: String,
            default: '+91',
        },
        phone: {
            type: String,
            validate: [validator.isMobilePhone, 'Please provide a valid phone number']
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
userSchema.methods.comparePassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
}
userSchema.methods.isPasswordChanged = async function(tokenIssuedAt){
    if(this.passwordChangedAt){
        const passwordChangeTimestamp = parseInt(this.passwordChangedAt.getTime()/1000);

        return tokenIssuedAt < passwordChangeTimestamp;
    }
    return false;
}

userSchema.methods.generateResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetTokenExpiresAt = Date.now() + (10 * 60 * 1000);
    return resetToken
}
userSchema.pre(/^find/, async function(){
   this.find({ isActive: true });
});
const user = mongoose.model('User', userSchema);

module.exports = user;