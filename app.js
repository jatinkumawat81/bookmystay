const express = require('express');
const hotelRouter = require('./routers/hotelsRouter');
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

module.exports = app;