const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Hotel name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Hotel description is required'],
        trim: true
    },
    type: { 
        type: String,
        required: [true, 'Hotel type is required']
    },
    city: {
        type: String,
        required: [true, 'Hotel city is required']
    },
    address: {
        type: String,
        required: [true, 'Hotel address is required'],
        trim: true
    },
    distance: {
        type: String,
        required: [true, 'Hotel distance from airport is required']
    },
    images: {
        type: [String]
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    rooms: {
        type: [String]
    },
    cheapestPrice: {
        type: Number,
        required: [true, 'Hotel cheapest price is required']
    },
    featured: {
        type: Boolean,
        default: false
    },
    category: {
        type: [String],
        required: [true, 'Hotel category is required']
    }
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

hotelSchema.virtual('isPremium').get(function(){
    return this.rating >= 4.5 && this.cheapestPrice >= 500;
});
module.exports = mongoose.model('Hotel', hotelSchema, 'hotels');