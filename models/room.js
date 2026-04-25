const mongoose = require('mongoose');

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

module.exports = mongoose.model('Room', roomSchema);