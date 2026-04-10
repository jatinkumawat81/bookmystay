const Hotel = require('../models/hotel'); 
exports.getAll = async (req, res)=>{
    try{
        // const hotels = await Hotel.find();
        // const hotels = await Hotel.find().where('city').equals(req.query.city);
        const hotels = await Hotel.find(res.query);
        res.status(200).json(
            {
                status: 'success',
                count: hotels.length,
                data: {
                    hotels
                }
            }
        );
    }catch(err){
        res.status(500).json({
            message: 'Error fetching hotels',
            error: err.message
        });
    }
}

exports.create = async (req, res)=>{
    try{
        // const hotel = new Hotel(req.body);
        // const savedHotel = await hotel.save();
        const hotel = await Hotel.create(req.body);
        res.status(201).json({
            status: 'success',
            message: 'Hotel created successfully',
            data: {
                hotel
            }
        });
    }catch(err){
        res.status(400).json({
            message: 'Error creating hotel',
            error: err.message
        });
    }
}

exports.getById = async (req, res)=>{
    try{
        const _id = req.params.id;
        const hotel = await Hotel.findById(_id);
        res.status(200).json({
            status: 'success',
            data: {
                hotel
            }
        });
    }catch(err){
        res.status(500).json({
            message: 'Error fetching hotel',
            error: err.message
        });
    }
}

exports.update = async (req, res)=>{
    try{
        const _id = req.params.id;
        const body = req.body;
        const hotel = await Hotel.findByIdAndUpdate(_id, body, {new: true, runValidators: true});
        res.status(200).json({
            status: 'success',
            data: {
                hotel
            }
        });
    }catch(err){
        res.status(500).json({
            message: 'Error updating hotel',
            error: err.message
        });
    }
}

exports.delete = async (req, res)=>{
    try{
        const _id = req.params.id;
        const hotel = await Hotel.findByIdAndDelete(_id);
        res.status(204).json({
            status: 'success',
            data: {
                hotel
            }
        });
    }catch(err){
        res.status(500).json({
            message: 'Error deleting hotel',
            error: err.message
        });
    }
}
