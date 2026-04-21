const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");
const User = require("../models/user");
const signToken = require("../utilities/signToken");

exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    const isMatch = await user.comparePassword(req.body.currentPassword, user.password);
    if (!isMatch) {
        return next(new AppError("Current password is incorrect", 401));
    }

    user.password = req.body.newPassword;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    const token = signToken(user._id);
    res.status(200).json({
        status: "success",
        message: "Password updated successfully",
        token,
        data: {
            user
        }
    });

});

exports.updateMe = catchAsync(async (req, res, next) => {

    if(req.body.password || req.body.confirmPassword){
        return next(new AppError("Use Update Password to change your password", 400));
    }
    
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    const userDetailsToUpdate = {
        firstName: req.body.firstName || user.firstName,
        lastName: req.body.lastName || user.lastName,
    };
    const updatedUser = await User.findByIdAndUpdate(req.user._id, userDetailsToUpdate, { new: true, runValidators: true });
    
    res.status(200).json({
        status: "success",
        message: "Profile updated successfully",
        data: {
            user: updatedUser
        }
    });

});

exports.deleteMe = catchAsync(async (req, res, next) => {
    const deleteUser = await User.findByIdAndUpdate(req.user._id, { isActive: false });
    if (!deleteUser) {
        return next(new AppError("User not found", 404));
    }
    res.status(204).json({
        status: "success",
        message: "Account deleted successfully",
        data: null
    });

});