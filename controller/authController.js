const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user');

exports.signup = catchAsync(async(req, res, next)=>{
    const user = await User.create(req.body);
    res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        data: {
            user
        }
    });
})