const mongoose = require('mongoose');
const Hotel = require('./hotel');
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
reviewSchema.statics.calcAverageRatings = async function(hotelId) {
    const reviewStats = await this.aggregate([
        {
            $match: { hotel: hotelId }
        },
        {
            $group: {
                _id: '$hotel',
                count: { $sum: 1 },
                avgRating: { $avg: '$ratings' }
            }
        }
    ]);
    await Hotel.findByIdAndUpdate(hotelId, {
        avgrating: reviewStats[0] ? reviewStats[0].avgRating : 3,
        reviewsCount: reviewStats[0] ? reviewStats[0].count : 0
    }, {
        new: true
    })
};
reviewSchema.post('save', function() {
    this.constructor.calcAverageRatings(this.hotel);
});
reviewSchema.post(/^findOneAnd/, async function(doc, next) {
    if(!doc) return next();
    await doc.constructor.calcAverageRatings(doc.hotel);
    next();
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;