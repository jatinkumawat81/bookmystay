const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
exports.deleteOne = (Model, name) => catchAsync(async (req, res, next)=>{
    const _id = req.params.id;
    const document = await Model.findByIdAndDelete(_id);
    if(!document){
        return next(new AppError(`${name} not found`, 404));
    }
    res.status(204).json({
        status: 'success',
        message: `${name} deleted successfully`
    });
});

exports.updateOne = (Model, name) => catchAsync(async (req, res, next)=>{
        const _id = req.params.id;
        const body = req.body;
        const document = await Model.findOneAndUpdate({_id: _id}, body, {new: true, runValidators: true});
        if(!document){
            return next(new AppError(`${name} not found`, 404));
        }
        //For room model, we want to call calcCheapestPrice after updating the room price
        if(Model.name === 'Room') {
            const hotelId = _id;
            await Model.calcCheapestPrice(hotelId);
        }
        res.status(200).json({
            status: 'success',
            data: {
                [name]: document
            }
        });
})