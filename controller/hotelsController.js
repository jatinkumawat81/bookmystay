const ApiFeatures = require('../utilities/features');
const Hotel = require('../models/hotel'); 
const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');


exports.getAll = catchAsync(async (req, res, next)=>{
    const features = new ApiFeatures(Hotel.find(),req.query);
        const query = features.filter().sort().limitFields().paginate().queryObj;
 
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
})

exports.create = catchAsync(async (req, res, next)=>{
    const hotel = await Hotel.create(req.body);
    res.status(201).json({
        status: 'success',
        message: 'Hotel created successfully',
        data: {
            hotel
        }
    });
})

exports.getById = catchAsync(async (req, res, next)=>{
        const _id = req.params.id;
        const hotel = await Hotel.findById(_id);
        if(!hotel){
            return next(new AppError('Hotel not found', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                hotel
            }
        });
})

exports.update = catchAsync(async (req, res, next)=>{
        const _id = req.params.id;
        const body = req.body;
        const hotel = await Hotel.findOneAndUpdate({_id: _id}, body, {new: true, runValidators: true});
        if(!hotel){
            return next(new AppError('Hotel not found', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                hotel
            }
        });
})

exports.delete = catchAsync(async (req, res, next)=>{
    try{
        const _id = req.params.id;
        const hotel = await Hotel.findByIdAndDelete(_id);
        if(!hotel){
            return next(new AppError('Hotel not found', 404));
        }
        res.status(204).json({
            status: 'success',
            message: 'Hotel deleted successfully'
        });
    }catch(err){
        res.status(500).json({
            message: 'Error deleting hotel',
            error: err.message
        });
    }
})

// exports.getHotelsStats = async (req, res)=>{
//     try{
//         const stats = await Hotel.aggregate([
//             {
//                 $match:{
//                     type: { $in: ['Hotel', 'Resort'] }
//                 }
//             },
//             {
//                 $group: {
//                     _id: '$city',
//                     avgRating: { $avg: '$rating' },
//                     avgPrice: { $avg: '$cheapestPrice' },
//                     minCheapestprice: { $min: '$cheapestPrice' },
//                     maxCheapestprice: { $max: '$cheapestPrice' },
//                     totalCheapestprice: { $sum: '$cheapestPrice' },
//                     totalHotels: { $sum: 1 }
//                 }
//             },
//             {
//                 $sort: { minCheapestprice: 1 }
//             },
//             {
//                 $match: { totalHotels: { $gte: 3 } }
//             },
//             {
//                 $sort: { totalHotels: -1 }
//             }
//         ])
//         res.status(200).json({
//             status: 'success',
//             count: stats.length,
//             data: {
//                 stats
//             }
//         });
//     }catch(err){
//         res.status(500).json({
//             message: 'Error fetching hotels stats',
//             error: err.message
//         });
//     }
// }

// exports.getHotelsByCategory = async (req, res)=>{
//     try{
//         const category = req.params.category;
//         const hotels = await Hotel.aggregate([
//             {
//                 $unwind: '$category'
//             },
//             {
//                 $group: {
//                     _id: '$category',
//                     hotels: { $push: '$name' },
//                     totalHotels: { $sum: 1 }
//                 }
//             },
//             {
//                 $addFields: {
//                     category: '$_id'
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     category: 1,
//                     hotels: 1,
//                     totalHotels: 1
//                 }
//             },
//             {
//                 $match: { category: category }
//             },
//             {
//                 $sort: { totalHotels: -1 }
//             },
//             // {
//             //     $limit: 5
//             // }
//         ]);
//         res.status(200).json({
//             status: 'success',
//             count: hotels.length,
//             data: {
//                 hotels
//             }
//         });
//     }catch(err){
//         res.status(500).json({
//             message: 'Error fetching hotels stats',
//             error: err.message
//         });
//     }
// }

exports.getFeaturedHotels = catchAsync(async (req, res, next) =>{
        const featuredHotels = await Hotel.aggregate([
            {
                $match: { featured: true }
            },
            {
                $sort: { ratings: -1 }
            },
            {
                $limit: 4
            }
        ])
        res.status(200).json({
            status: 'success',
            count: featuredHotels.length,
            data: {
                hotels: featuredHotels
            }
        });
})

exports.getHotelsByCity = catchAsync(async (req, res, next) =>{
        const hotelsByCity = await Hotel.aggregate([
            {
                $group: {
                    _id: '$city',
                    count: { $sum: 1 },
                    cheapestPrice: { $min: '$cheapestPrice' },
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $addFields: { city: '$_id' }
            },
            {
                $project: { _id: 0 }
            },
            {
                $limit: 3
            }
        ])
        res.status(200).json({
            status: 'success',
            data: {
                hotels: hotelsByCity
            }
        });
})
exports.getHotelsByType = catchAsync(async (req, res, next) =>{
        const hotelsByType = await Hotel.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 },
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $addFields: { type: '$_id' }
            },
            {
                $project: { _id: 0 }
            },
            {
                $limit: 3
            }
        ])
        res.status(200).json({
            status: 'success',
            data: {
                hotels: hotelsByType
            }
        });
})