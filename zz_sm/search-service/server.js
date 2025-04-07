const express = require('express')
const mongoose = require('mongoose')
const Redis = require('ioredis')
const cors = require('cors')
const helmet = require('helmet')
const { connectToRabbitMQ,consumeEvent } = require('./utils/rabbitmq')
const router = require('./routes/searchRoutes')
const {handlePostCreated,handlePostDeleted} = require('./eventHandlers/searchEventHandlers')

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://10ohekabanzai:f22pakfaamcA@cluster0.r08sa.mongodb.net/sm');
        console.log('Connected to DB');
    } catch (error) {
        console.error(error);
    }
};

connectDB();

const app = express()
// middlewares
app.use(helmet())
app.use(cors())
app.use(express.json())

const redisClient = new Redis({
    host: '127.0.0.1',
    port: 6379
});

app.use('/api/search',(req,res,next)=>{
    req.redisClient = redisClient;
    next();
},router)

async function startServer(){
    try {
        await connectToRabbitMQ();
        // consume the events
        await consumeEvent('post.created',handlePostCreated)
        await consumeEvent('post.deleted',handlePostDeleted)
        app.listen(3004,()=>{
            console.log('Search service running on Port 3004')
        })        
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

startServer()

