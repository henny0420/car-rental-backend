
const validate= (schema) => {
    return(req,res,next) => {
        for(key in schema){
            console.log("key : " , key);
            const {error , value} = schema[key].validate(req[key], {
                stripeUnknown : true,
            })
         
         if(error){
            return res.status(422).json({
                error :error?.details,
            })
         }
         req[key] = value
         }
         next()
    }
}

module.exports = validate