const authenticateRequest = async(req,res,next)=>{
    const userId = req.headers['x-user-id']
    if(!userId){
        return res.status(401).json({success:false,message:"Missing auth token in header!, Please Login"})
    }

    req.user = {userId}
    next()
}

module.exports = {authenticateRequest}