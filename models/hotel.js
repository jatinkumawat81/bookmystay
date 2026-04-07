const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Hotel name is required'],
        unique: [true, 'Hotel name must be unique'],
        minLength: [5, 'Hotel name must be at least 5 characters'],
        maxLength: [100, 'Hotel name must be at most 100 characters']
    },
    description: {
        type: String,
        maxLength: [200, 'Description must be at most 200 characters']
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [100, 'Price must be at least 100'],
        max: [10000, 'Price must be at most 10000']
    },
    rating: {
        type: Number,
        max: [5, 'Rating must be at most 5'],
        default: 1.0
    }
})

module.exports = mongoose.model('Hotel', hotelSchema, 'hotels');