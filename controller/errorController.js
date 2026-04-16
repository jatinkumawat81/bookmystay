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
       prodErrors(res, appError);
    }
}