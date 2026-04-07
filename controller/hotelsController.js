const Hotel = require('../models/hotel'); 
exports.getAll = (req, res)=>{
    
}

exports.create = (req, res)=>{
    res.status(201).json({
        message: 'Hotel created successfully',
        hotel: req.body
    });
}

exports.getById = (req, res)=>{
    const hotelId = req.params.id;
    res.status(200).json({
        hotel: { id: hotelId, name: 'Hotel California', city: 'Los Angeles' }
    });
}