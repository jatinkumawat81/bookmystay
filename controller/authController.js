const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const sendEmail = require("./../utilities/email");
const crypto = require('crypto');
const signToken = require("../utilities/signToken");


exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  const token = signToken(user._id);
  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: {
      user,
      token,
    },
  });
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || email.trim() === "") {
    return next(new AppError("Please provide email", 400));
  }
  if (!password || password.trim() === "") {
    return next(new AppError("Please provide password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("User with given email not found", 400));
  }

  if (!(await user.comparePassword(password, user.password))) {
    return next(new AppError("Incorrect password", 401));
  }
  const token = signToken(user._id);
  res.status(201).json({
    status: "success",
    message: "User logged in successfully",
    data: {
      token,
    },
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("Cannot find the user with provided email.", 404));
  }

  const plainResetToken = user.generateResetToken();

  await user.save({ validateBeforeSave: false });

  const resetTokenLink = `${req.protocol}://${req.get("host")}/api/v1/auth/resetPassword/${plainResetToken}`;

  const message = `We have received a password reset request. Please use the link below to reset your password:\n\n${resetTokenLink}\n\nThis link is valid for 10 minutes.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message: message,
    });

    return res.status(200).json({
      status: "success",
      message: "A password reset link has been sent to your email.",
    });

  } catch (error) {

    user.resetToken = undefined;
    user.resetTokenExpiresAt = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending password reset email. Please try again later.",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {

    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        resetToken: hashedToken,
        resetTokenExpiresAt: { $gt: Date.now() }
    });

    if (!user) {
        return next(
            new AppError("Reset token is not valid or it has expired.", 400)
        );
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.resetToken = undefined;
    user.resetTokenExpiresAt = undefined;
    user.passwordChangedAt = Date.now();

    await user.save();

    const token = signToken(user._id);

    res.status(200).json({
        status: "success",
        message: "Password reset successful",
        token
    });
});

exports.isAuthenticated = catchAsync(async (req, res, next) => {
  const testToken = req.headers.authorization;
  let token = null;
  if (!testToken || !testToken.startsWith("Bearer ")) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401),
    );
  }
  if (testToken && testToken.startsWith("Bearer ")) {
    token = testToken.split(" ")[1];
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError("User does not exist. Access denied.", 401));
  }

  const passwordWasChanged = await currentUser.isPasswordChanged(decoded.iat);

  if (passwordWasChanged) {
    return next(new AppError("Password was changed. Please login again.", 401));
  }
  req.user = currentUser;
  next();
});

exports.isAuthorized = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action.", 403),
      );
    }
    next();
  };
};
