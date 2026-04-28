const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
const Review = require('../models/review');
const Hotel = require('../models/hotel');
const User = require('../models/user');
const factory = require('./handlerFactory');

exports.create = catchAsync(async (req, res, next)=>{
    const reviewData = {
        ratings: req.body.ratings,
        comment: req.body.comment,
        user: req.user._id,
        hotel: req.params.hotelId
    }
    const review = await Review.create(reviewData);

    res.status(201).json({
        status: 'success',
        data: {
            review
        }
    });
});

exports.getAll = catchAsync(async (req, res, next)=>{
    // const reviews = await Review.find({hotel: req.params.hotelId});
    const reviews = await Review.find();
    res.status(200).json({
        status: 'success',
        count: reviews.length,
        data: {
            reviews
        }
    });
});

exports.delete = factory.deleteOne(Review, 'Review');

exports.update = factory.updateOne(Review, 'Review');