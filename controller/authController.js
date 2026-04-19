const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
}
exports.signup = catchAsync(async(req, res, next)=>{
    const user = await User.create(req.body);
    const token = signToken(user._id);
    res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        data: {
            user,
            token
        }
    });
})
exports.login = catchAsync(async(req, res, next)=>{
    const {email, password} = req.body;
    if(!email || email.trim() === ''){
        return next(new AppError('Please provide email', 400));
    }
    if(!password || password.trim() === ''){
        return next(new AppError('Please provide password', 400));
    }
    const user = await User.findOne({email}).select('+password');
    if(!user){
        return next(new AppError('User with given email not found', 400));
    }

    if(!(await user.comparePassword(password, user.password))){
        return next(new AppError('Incorrect password', 403));
    }
    const token = signToken(user._id);
    res.status(201).json({
        status: 'success',
        message: 'User logged in successfully',
        data: {
            token
        }
    });
});
exports.isAuthenticated = catchAsync(async(req, res, next)=>{
    const testToken = req.headers.authorization;
    const token = null;
    if(!testToken || !testToken.startsWith('Bearer ')){
        return next(new AppError('You are not logged in! Please log in to get access', 401));
    }
    if(testToken && testToken.startsWith('Bearer ')){
        token = testToken.split(' ')[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
});