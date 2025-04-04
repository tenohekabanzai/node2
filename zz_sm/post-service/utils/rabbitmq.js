const amqp = require('amqplib')

let connection = null;
let channel = null;

const EXCHANGE_NAME = 'facebook_events'

const connectToRabbitMQ = async()=>{
    try {
        connection = await amqp.connect("amqp://localhost:5672");
        channel = await connection.createChannel()

        await channel.assertExchange(EXCHANGE_NAME,'topic',{durble: false})
        console.log('connected to rabbitMQ')

        return channel;
    } catch (error) {
        console.log(error)
    }
}

module.exports = {connectToRabbitMQ}