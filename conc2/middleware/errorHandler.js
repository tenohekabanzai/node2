class APIError extends Error{
    constructor(message,statusCode){
        super(message)
        this.statusCode = statusCode
        this.name = 'APIError'
    }
}

// this replaces trycatch block for requests !!!
const asyncHandler = (fn)=>(req,res,next)=>{
    Promise.resolve(fn(req,res,next)).catch(next)
}

const globalErrorHandler = (err,req,res,next)=>{
    // console.log(err.stack)
    console.log("Error ocurrred")
    if(err instanceof APIError){
        return res.status(err.statusCode).json({
            status: 'Error',
            message: err.message
        })
    }
    // handle validation
    else if(err.name === 'validationError'){
        return res.status(400).json({
            status: 'error',
            messsage: 'validation Error'
        })
    }
    else {
        return res.status(500).json({
            status: 'error',
            messsage: 'unexpected Error'
        })
    }
}

module.exports = {
    globalErrorHandler,
    asyncHandler,
    APIError
}