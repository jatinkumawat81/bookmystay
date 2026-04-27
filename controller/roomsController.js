const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");
const Room = require("../models/room");
const Hotel = require("../models/hotel");

exports.create = catchAsync(async (req, res, next)=>{
    const hotelId = req.params.hotelId;
    const room = await Room.create(req.body);
    await Hotel.findByIdAndUpdate(hotelId, {$push: {rooms: room._id}});
    res.status(201).json({
        status: 'success',
        message: 'Room created successfully',
        data: {
            room 
        }
    });
});

exports.delete = catchAsync(async (req, res, next)=>{
    const hotelId = req.params.hotelId;
    const _id = req.params.id;
    const room = await Room.findByIdAndDelete(_id);
    await Hotel.findByIdAndUpdate(hotelId, {$pull: {rooms: req.params.id}});
    if(!room){
        return next(new AppError('Room not found', 404));
    }
    res.status(204).json({
        status: 'success',
        message: 'Hotel deleted successfully'
    });
});

exports.getAll = catchAsync(async (req, res, next)=>{
    const rooms = await Room.find();
    res.status(200).json({
        status: 'success',
        data: {
            rooms
        }
    });
});
exports.getById = catchAsync(async (req, res, next)=>{
    const _id = req.params.id;
    const room = await Room.findById(_id);
    if(!room){
        return next(new AppError('Room not found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            room
        }
    });
});