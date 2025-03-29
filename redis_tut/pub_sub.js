// publisher -> send -> channel -> subscriber will consume
const redis = require('redis')

const client = redis.createClient({
    host:'localhost',
    port: 6379
})

// event listeners
client.on('error',(error)=> console.log("Redis client error occured"))

const test_pub_sub = async()=>{
    try {
        // client is publisher
        await client.connect();
        // client a new client as subscriber
        const subscriber = client.duplicate(); 
        await subscriber.connect()

        await client.flushAll();

        // listens for messages from dummy channel
        await subscriber.subscribe(
            'dummy-channel',(message,channel)=>{
                console.log(`Received messge from ${channel}: ${message}`)
            }
        )

        //publish message to dummy channel
        await client.publish('dummy-channel', 'Some dummy data from publisher')
        await client.publish('dummy-channel', 'Some dummy data 2 from publisher')

        await new Promise((resolve)=>setTimeout(resolve,1000))

        await subscriber.unsubscribe('dummy-channel')
        await subscriber.quit()

        // pipelining and transactions
        const multi = client.multi()
        multi.set('key-transaction1',"val1")
        multi.set('key-transaction2',"val2")
        multi.get('key-transaction1')
        multi.get('key-transaction2')

        const res = await multi.exec()
        console.log(res)

        const pipeline = client.multi()
        pipeline.set('key-pipeline1',"val1")
        pipeline.set('key-pipeline2',"val2")
        pipeline.get('key-pipeline1')
        pipeline.get('key-pipeline2')

        const res2 = await pipeline.exec()
        console.log(res2)

        const pipelineOne = client.multi()
        for(let i=0;i<1000;i++){
            pipelineOne.set(`user:${i};action`,`Action ${i}`)
        }
        const r3 = await pipelineOne.exec()
        console.log(r3)

        // example of a transaction
        await client.set('account:1234:balance',100000);
        const dummyexample = await client.multi()
        dummyexample.decrBy('account:1234:balance',1000)
        dummyexample.incrBy('account:1234:balance',2000)
        const fin = await dummyexample.exec();
        console.log(fin)
        const remAmt = await client.get('account:1234:balance')
        console.log(remAmt)

    } catch (error) {
        console.log(error)
    } finally{
        await client.quit();
        console.log("Connection closed")
    }
}


test_pub_sub()

