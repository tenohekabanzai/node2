const express = require('express')
const mongoose = require('mongoose')
const Redis = require('ioredis')
const cors = require('cors')
const helmet = require('helmet')
const router = require('./routes/postRoutes')
const {RateLimiterRedis} = require('rate-limiter-flexible')
const {rateLimit} = require('express-rate-limit')
const {RedisStore} = require('rate-limit-redis')
const {connectToRabbitMQ} = require('./utils/rabbitmq')

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://10ohekabanzai:f22pakfaamcA@cluster0.r08sa.mongodb.net/sm');
        console.log('Connected to DB');
    } catch (error) {
        console.error(error);
    }
};

connectDB();

const app = express();

// middlewares
app.use(helmet())
app.use(cors())
app.use(express.json())

const redisClient = new Redis({
    host: '127.0.0.1',
    port: 6379
});

const rateLimiter = new RateLimiterRedis({
    storeClient : redisClient,
    keyPrefix: 'middleware',
    points: 10,
    duration: 1
})
// rate limiting every client to 10 reqs per second
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

// rate limiting sensitive routes
app.use('/api/posts/create-post',sensitiveEndpointsLimiter);

app.use('/api/posts',(req,res,next)=>{
    req.redisClient = redisClient;
    next();
},router);



const startServer = async()=>{
    try {
        await connectToRabbitMQ()
        app.listen(3002,()=>{
            console.log("Post Service running on PORT 3002")
        })
    } catch (error) {
        console.log('failed to connect to server')
        process.exit(1)
    }
}

startServer();