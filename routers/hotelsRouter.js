const hotelController = require('./../controller/hotelsController');
const express = require('express');
const authController = require('../controller/authController');
const hotelRouter = express.Router();

hotelRouter.route('/get-featured')
    .get(hotelController.getFeaturedHotels);
hotelRouter.route('/get-hotels-by-city')
    .get(hotelController.getHotelsByCity);
hotelRouter.route('/get-hotels-by-type')
    .get(hotelController.getHotelsByType);
// hotelRouter.route('/get-hotel-stats')
//     .get(hotelController.getHotelsStats);
// hotelRouter.route('/get-hotel-by-category/:category')
//     .get(hotelController.getHotelsByCategory);
hotelRouter.route('/')
    .get(hotelController.getAll)
    .post(authController.isAuthenticated, hotelController.create);

hotelRouter.route('/:id')
    .get(hotelController.getById)
    .put(authController.isAuthenticated, hotelController.update)
    .delete(authController.isAuthenticated, hotelController.delete);

module.exports = hotelRouter;