const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const Redis = require('ioredis')
const {rateLimit} = require('express-rate-limit')
const {RedisStore} = require('rate-limit-redis')
const proxy = require('express-http-proxy')
const {RateLimiterRedis} = require('rate-limiter-flexible')
const validateToken = require('./middleware/authMiddleware')

const app = express();

const redisClient = new Redis({
    host: '127.0.0.1',
    port: 6379
});

// middlewares
app.use(helmet())
app.use(cors())
app.use(express.json())

const rateLimiter = new RateLimiterRedis({
    storeClient : redisClient,
    keyPrefix: 'middleware',
    points: 10,
    duration: 1
})

app.use((req,res,next)=>{
    rateLimiter
    .consume(req.ip)
    .then(()=>next())
    .catch(()=>{
        console.log(`rate limited exceeded form ip ${req.ip}`);
        res.status.send(429).json({success:false,message:'rate limit exceeded!'})
    })
})

const ratelimit = rateLimit({
    windowMs : 15*60*1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req,res)=>{
        console.log(`Sensitive endpoint rate limit exceeded for IP : ${req.ip}`)
        res.status(429).json({success: false, message:"Too many requests"})
    },
    store: new RedisStore({
        sendCommand: (...args)=> redisClient.call(...args)
    }),
})
app.use(ratelimit)


const proxyOptions = {
    proxyReqPathResolver: (req)=>{
        return req.originalUrl.replace(/^\/v1/, "/api")
    },
    proxyErrorHandler: (err,res,next)=>{
        console.log(`proxy error : ${err.message}`)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

app.use('/v1/auth',proxy('http://localhost:3001',{
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts,srcReq)=>{
        proxyReqOpts.headers['Content-Type'] = 'application/json'
        return proxyReqOpts
    },
    userResDecorator: (proxyRes,proxyResData,userReq,userRes)=>{
        return proxyResData
    }
}))

app.use('/v1/posts',validateToken,proxy('http://localhost:3002',{
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts,srcReq)=>{
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.headers['x-user-id'] = srcReq.user.userId;
        return proxyReqOpts
    },
    userResDecorator: (proxyRes,proxyResData,userReq,userRes)=>{
        return proxyResData
    }
}))

app.listen(3000,()=>{
    console.log('Api Gateway running on PORT 3000')
    console.log('Identity Service running on PORT 3001')
    console.log('Post Service running on PORT 3002')
})