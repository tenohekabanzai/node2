const amqp = require('amqplib')

let connection = null;
let channel = null;

const EXCHANGE_NAME = 'facebook_events'

const connectToRabbitMQ = async()=>{
    try {
        connection = await amqp.connect("amqp://localhost:5672");
        channel = await connection.createChannel()

        // await channel.deleteExchange('facebook_events')
        await channel.assertExchange(EXCHANGE_NAME,'topic',{durable: false})
        console.log('connected to rabbitMQ')

        return channel;
    } catch (error) {
        console.log(error)
    }
}

const publishEvent = async(routingKey,message)=>{
    if(!channel){
        await connectToRabbitMQ()
    }

    channel.publish(EXCHANGE_NAME,routingKey,Buffer.from(JSON.stringify(message)))
    console.log(`Event published ${routingKey}`)
}

module.exports = {connectToRabbitMQ,publishEvent}