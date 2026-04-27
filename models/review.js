const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    ratings: {
        type: Number,
        required: [true, 'Review rating is required'],
        min: [0, 'Review rating must be at least 0'],
        max: [5, 'Review rating must be at most 5']
    },
    comment: {
        type: String,
        required: [true, 'Review comment is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Review user is required']
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: [true, 'Review hotel is required']
    },
}, {timestamps: true});

reviewSchema.pre(/^find/, function(){
    this.populate({
        path: 'user',
        select: 'firstName lastName photo email'
    });
});

module.exports = mongoose.model('Review', reviewSchema);