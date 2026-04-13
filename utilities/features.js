class ApiFeatures {

    constructor(queryObj, queryParam){
        this.queryObj = queryObj;
        this.queryParam = queryParam;
    }

    filter(){
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        const queryObj = {...this.queryParam};
        excludeFields.forEach(el => delete queryObj[el]);
        // const hotels = await Hotel.find();
        // const hotels = await Hotel.find().where('city').equals(this.queryParam.city);
        let filterQuery = this.getFinalFilterQuery(queryObj);
        // const hotels = await Hotel.find(filterQuery);
        this.queryObj = this.queryObj.find(filterQuery);

        return this;
    }
    //sorting results
    sort(){
        if(this.queryParam.sort){
            this.queryObj = this.queryObj.sort(this.queryParam.sort.split(',').join(' '));
        }else{
            this.queryObj = this.queryObj.sort('cheapestPrice');
        }
        return this;
    }
    //feild limiting
    limitFields(){
        if(this.queryParam.fields){
            this.queryObj = this.queryObj.select(this.queryParam.fields.split(',').join(' '));
        }else{
            this.queryObj = this.queryObj.select('-__v');
        }
        return this;
    }
    //pagination
    paginate(){
        const limit = this.queryParam.limit * 1 || 10;
        const page = this.queryParam.page * 1 || 1;
        const skip = (page - 1) * limit;
        this.queryObj = this.queryObj.skip(skip).limit(limit);
        // if(this.queryParam.page){
        //     const totalDocuments = await Hotel.countDocuments();
        //     if(skip >= totalDocuments){
        //         throw new Error('Page number exceeds total pages');
        //     }
        // }
        return this;
    }
    getFinalFilterQuery = (queryObj) => {
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
}
module.exports = ApiFeatures;