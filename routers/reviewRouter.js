const express = require('express');
const authController = require('../controller/authController');
const reviewController = require('../controller/reviewController');
const reviewRouter = express.Router({mergeParams: true});

reviewRouter.route('/')
    .post(authController.isAuthenticated, authController.isAuthorized('user'), reviewController.create)
    .get(reviewController.getAll);

module.exports = reviewRouter;