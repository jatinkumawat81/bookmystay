const express = require('express');
const authController = require('../controller/authController');
const reviewController = require('../controller/reviewController');
const reviewRouter = express.Router({mergeParams: true});

reviewRouter.route('/')
    .post(authController.isAuthenticated, authController.isAuthorized('user'), reviewController.create)
    .get(reviewController.getAll);
reviewRouter.route('/:id')
    .delete(authController.isAuthenticated, authController.isAuthorized('user'), reviewController.delete)
    .patch(authController.isAuthenticated, authController.isAuthorized('user'), reviewController.update);
module.exports = reviewRouter;