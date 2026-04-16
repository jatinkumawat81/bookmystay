const express = require('express');
const hotelRouter = require('./routers/hotelsRouter');
const userRouter = require('./routers/usersRouter');
const AppError = require('./utilities/appError');
const globalErrorHandler = require('./controller/errorController');
const app = express();

app.use(express.json());

// const logger = (req, res, next) => {
//     console.log(`${req.method} ${req.originalUrl}`);
//     next();
// }
if(process.env.NODE_ENV === 'development'){
    const morgan = require('morgan');
    app.use(morgan('dev'));
    // app.use(logger);
}

app.use('/api/v1/hotels', hotelRouter);
app.use('/api/v1/users', userRouter);
app.all('*splat', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: 'Route not found'
    // });
    // const err = new Error('Route not found');
    // err.statusCode = 404;
    // err.status = 'fail';
    // next(err);
    const err = new AppError(`Cannot find the resource ${req.originalUrl}`, 404);
    next(err);

});

app.use(globalErrorHandler)
module.exports = app;