const redis = require('redis')

const client = redis.createClient({
    host:'localhost',
    port: 6379
})

// event listeners
client.on('error',(error)=> console.log("Redis cleint error occured"))

const testRedisConnection = async()=>{
    try {
        await client.connect();
        console.log('Connected to redis');

        await client.set("name","Tito")
        let name_val = await client.get("name")
        console.log(name_val)

        const del_Count = await client.del('name')
        console.log(del_Count)

        name_val = await client.get("name")
        console.log(name_val)

        await client.set("count",100)

        const inCount = await client.incr("count")
        console.log(inCount)
        const decCount = await client.decr("count")
        console.log(decCount)

    } catch (error) {
        console.log(error)
    } finally{
        await client.quit();
        console.log("Connection closed")
    }
}

testRedisConnection()

