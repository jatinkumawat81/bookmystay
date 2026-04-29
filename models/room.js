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
    console.log('Hotel :', hotel);
    if(!hotel) return;
    if(hotel.rooms.length === 0 || !hotel.rooms) {
        await Hotel.findByIdAndUpdate(hotelId, { cheapestPrice: 120 });
        return;
    }
    const roomStats = await this.aggregate([
        {
            $match: { _id: { $in : hotel.rooms} }
        },
        {
            $group: {
                _id: null,
                mminPrice: { $min: '$price' },
            }
        }
    ]);
    console.log('Room Stats :', roomStats);
    await Hotel.findByIdAndUpdate(hotelId, { cheapestPrice: roomStats[0] ? roomStats[0].mminPrice : 120 });
};
module.exports = mongoose.model('Room', roomSchema);