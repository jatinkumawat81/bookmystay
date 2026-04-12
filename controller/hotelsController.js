const Hotel = require('../models/hotel'); 
exports.getAll = async (req, res)=>{
    try{
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        const queryObj = {...req.query};
        excludeFields.forEach(el => delete queryObj[el]);
        // const hotels = await Hotel.find();
        // const hotels = await Hotel.find().where('city').equals(req.query.city);
        let filterQuery = getFinalFilterQuery(queryObj);
        // const hotels = await Hotel.find(filterQuery);
        let query = Hotel.find(filterQuery);

        //sorting results
        if(req.query.sort){
            query = query.sort(req.query.sort.split(',').join(' '));
        }else{
            query = query.sort('cheapestPrice');
        }

        //feild limiting
        if(req.query.fields){
            query = query.select(req.query.fields.split(',').join(' '));
        }else{
            query = query.select('-__v');
        }
        
        const hotels = await query;
        // const hotels = await Hotel.find({city: 'Mumbai', cheapestPrice: {$lte: 10000},rating: {$gte: 3}});

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

const getFinalFilterQuery = (queryObj) => {
    const finalQueryObj = {};
    for(let key in queryObj){
        const value = queryObj[key];
        const match = key.match(/^(.*)\[(gte|lte|gt|lt)\]$/);
        if(match){
            const fieldName = match[1];
            const operator = `$${match[2]}`;
            if(!finalQueryObj[fieldName]){
                finalQueryObj[fieldName] = {};
            }
            finalQueryObj[fieldName][operator] = value;
        }else{
            finalQueryObj[key] = value;
        }
    }
    return finalQueryObj;
}