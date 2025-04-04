const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const router = require('./routes/mediaRoutes')
const Redis = require('ioredis')
const {rateLimit} = require('express-rate-limit')
const {RedisStore} = require('rate-limit-redis')

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
// app.use('/api/media/upload',sensitiveEndpointsLimiter);

app.use('/api/media',router);

app.listen(3003,()=>{
    console.log("Media Service runing on Port 3003")
})
