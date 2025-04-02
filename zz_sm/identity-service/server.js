const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const {RateLimiterRedis} = require('rate-limiter-flexible')
const Redis = require('ioredis')
const {rateLimit} = require('express-rate-limit')
const {RedisStore} = require('rate-limit-redis')
const routes = require('./routes/identityRoute')

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://10ohekabanzai:f22pakfaamcA@cluster0.r08sa.mongodb.net/sm');
        console.log('Connected to DB');
    } catch (error) {
        console.error(error);
    }
};

connectDB();

const redisClient = new Redis({
    host: '127.0.0.1',
    port: 6379
});


const app = express()

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

// Ip based rate limiting from sensitiveEndpoint
const sensitiveEndpointsLimiter = rateLimit({
    windowMs : 15*60*1000,
    max: 50,
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

app.use('/api/auth/register',sensitiveEndpointsLimiter)

// Routes
app.use('/api/auth',routes)

app.listen(3001,()=>{
    console.log('Identity Service running on PORT 3001')
})

process.on('unhandledRejection',(reason,promise)=>{
    console.log('Unhandled Rejection at',promise,"reason:",reason)
})