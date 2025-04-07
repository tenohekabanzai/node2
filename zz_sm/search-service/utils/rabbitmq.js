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

const consumeEvent = async(routingKey,callback)=>{
    
    if(!channel)
    await connectToRabbitMQ()

    const q = await channel.assertQueue("",{exclusive:true});
    await channel.bindQueue(q.queue,EXCHANGE_NAME,routingKey)
    channel.consume(q.queue,(msg)=>{
        // console.log(msg);
        if(msg!=null)
        {
            const content = JSON.parse(msg.content.toString())
            callback(content)
            channel.ack(msg);
        }
    })

    console.log(`Subscribed to event ${routingKey}`)
}

module.exports = {connectToRabbitMQ,consumeEvent}