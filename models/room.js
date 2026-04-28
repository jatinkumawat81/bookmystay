const mongoose = require('mongoose');
const Hotel = require('./hotel');
const roomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Room title is required']
    },
    description: {
        type: String,
        required: [true, 'Room description is required']
    },
    price: {
        type: Number,
        required: [true, 'Room price is required'],
        min: [0, 'Room price must be a positive number']
    },
    maxPerson: {
        type: Number,
        required: [true, 'Room maximum occupancy is required'],
    },
    roomNumbers: {
        type: [Number],
        required: [true, 'Room numbers are required']
    },
    bookedDates: {
        type: [Date],
        default: []
    }
});

roomSchema.statics.calcCheapestPrice = async function(hotelId) {
    const hotel = await Hotel.findById(hotelId).select('rooms').lean();
    const roomStats = await this.aggregate([
        {
            $match: { hotel: hotelId }
        },
        {
            $group: {
                _id: '$hotel',
                cheapestPrice: { $min: '$price' }
            }
        }
    ]);
    return roomStats[0] ? roomStats[0].cheapestPrice : null;
};
module.exports = mongoose.model('Room', roomSchema);