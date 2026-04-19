const AppError = require('../utilities/appError');
const devErrors = (res, err) =>{
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message || 'Something went wrong',
        stack: err.stack,
        error: err
    });
}
const prodErrors = (res, err) =>{
    if(err.isOperational){
        res.status(err.statusCode || 500).json({
            status: err.status || 'error',
            message: err.message || 'Something went wrong',
        });
    }else{
        res.status(err.statusCode || 500).json({
            status: 'error',
            message: 'Something went wrong',
        });
    }
}
const handleCastError = (err) => {
    const errMsg = `Invalid value ${err.path}: ${err.value}`;
    const error = new AppError(errMsg, 400);
    return error;
}
const duplicateKeyHandler = (err) => {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const errMsg = `Duplicate field value: ${value} for field: ${field}. Please use another value!`;
    return new AppError(errMsg, 400);
}
const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const errMsg = `Invalid input data: ${errors.join(', ')}`;
    return new AppError(errMsg, 400);
}
const handleJWTError = (err) => {
    const errMsg = 'Invalid or expired token. Please log in again.';
    return new AppError(errMsg, 401);
}
const handleTokenExpiredError = (err) => {
    const errMsg = 'Your token has expired! Please log in again.';
    return new AppError(errMsg, 401);
}
module.exports = (err ,req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if(process.env.NODE_ENV === 'development'){
       devErrors(res, err);
    }else{
        let appError = { ...err };
        if(err.name === 'CastError'){
            appError = handleCastError(err);
        }
        if(err.code === 11000){
            appError = duplicateKeyHandler(appError);
        }
        if(err.name === 'ValidationError'){
            appError = handleValidationError(appError);
        }
        if(err.name === 'JsonWebTokenError'){
            appError = handleJWTError(appError);
        }
        if(err.name === 'TokenExpiredError'){
            appError = handleTokenExpiredError(appError);
        }
       prodErrors(res, appError);
    }
}