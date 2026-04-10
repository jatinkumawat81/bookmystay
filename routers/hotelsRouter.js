const hotelController = require('./../controller/hotelsController');
const express = require('express');
const hotelRouter = express.Router();

hotelRouter.route('/')
    .get(hotelController.getAll)
    .post(hotelController.create);

hotelRouter.route('/:id')
    .get(hotelController.getById)
    .put(hotelController.update)
    .delete(hotelController.delete);

module.exports = hotelRouter;