const jwt = require('jsonwebtoken')

const validateToken = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1]
    // console.log(token);
    if(!token){
        console.log('Token Header missing')
        return res.status(401).json({
            success:false,
            message: 'Auth header missing'
        })
    }
    jwt.verify(token,"JWT_SECRET",(err,user)=>{
        if(err){
            console.log('Invalid Token')
            return res.status(429).json({
                success:false,
                message: 'Auth header invalid'
            })
        }
        req.user = user
        next()
    })
}

module.exports = validateToken