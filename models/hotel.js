const mongoose = require('mongoose');
const fs = require('fs');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Hotel name is required'],
        trim: true,
        match: /^[a-zA-Z][a-zA-Z0-9\s\-_]*$/
    },
    description: {
        type: String,
        required: [true, 'Hotel description is required'],
        trim: true
    },
    type: { 
        type: String,
        required: [true, 'Hotel type is required'],
        enum: {
            values: ['Hotel', 'Resort', 'Apartment', 'Villa', 'Hostel'],
            message: 'Hotel type must be either Hotel, Resort, Apartment, Villa or Hostel'
        }
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
    },
    createdBy: String
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

hotelSchema.virtual('isPremium').get(function(){
    return this.rating >= 4.5 && this.cheapestPrice >= 500;
});

hotelSchema.pre('save', function(){
    this.createdBy = 'Jatin';
});
hotelSchema.pre('save', function(){
    if(this.cheapestPrice < 100){
        throw new Error('Cheapest price must be at least 100');
    }
});

hotelSchema.post('save', function(doc,next){
    const content = `${new Date()}: A new hotel named "${doc?.name}" was created by: ${doc?.createdBy}\n`;
    fs.writeFileSync('./logs/logs.txt', content, { flag: 'a' }, (err)=>{
        console.error('Error writing to log file:', err);
    });
    next();
});

hotelSchema.pre('find', function(){
    this.find({ isDeleted: false });
});
hotelSchema.pre('findOneAndUpdate', function(){
    const update = this.getUpdate();
    if(update.cheapestPrice && update.cheapestPrice < 100){
        throw new Error('Cheapest price must be at least 100');
    }
});
hotelSchema.post('findOneAndUpdate', function(doc, next){
 const content = `${new Date()}: A hotel named "${doc?.name}" was updated by: ${doc?.createdBy}\n`;
    fs.writeFileSync('./logs/logs.txt', content, { flag: 'a' }, (err)=>{
        console.error('Error writing to log file:', err);
    });
    next();
});

hotelSchema.pre('aggregate', function(){
    this.pipeline().unshift({ $match: { isDeleted: false } });
})
// hotelSchema.post('aggregate', function(results, next){
//     next();
// })
module.exports = mongoose.model('Hotel', hotelSchema, 'hotels');