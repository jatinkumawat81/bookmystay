exports.getAll = (req, res)=>{
    res.status(200).json({
        hotels: [
            { id: 1, name: 'Hotel California', city: 'Los Angeles' },
            { id: 2, name: 'The Grand Budapest Hotel', city: 'Zubrowka' },
            { id: 3, name: 'The Plaza Hotel', city: 'New York' }
        ]
    });
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