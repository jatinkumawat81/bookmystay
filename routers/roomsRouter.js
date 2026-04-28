const roomsController = require('../controller/roomsController');
const express = require('express');
const authController = require('../controller/authController');
const roomsRouter = express.Router({mergeParams: true});

roomsRouter.route('/')
    .post(authController.isAuthenticated, authController.isAuthorized('admin'), roomsController.create)
    .get(roomsController.getAll)
roomsRouter.route('/:id')
    .get(roomsController.getById)
    .patch(authController.isAuthenticated, authController.isAuthorized('admin'), roomsController.update)
    .delete(authController.isAuthenticated, authController.isAuthorized('admin'), roomsController.delete)

module.exports = roomsRouter;
