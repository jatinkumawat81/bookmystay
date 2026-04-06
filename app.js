const express = require('express');
const hotelRouter = require('./routers/hotelsRouter');
const app = express();

app.use(express.json());
app.use('/api/v1/hotels', hotelRouter);

module.exports = app;