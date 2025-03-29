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
        await client.flushAll();

        console.time('without pipelining')

      for(let i=0;i<1000;i++){
        await client.set(`user${i}`,`user_value${i}`)
      }
      console.timeEnd('without pipelining')

      console.time('with pipelining')

      const pipelineOne = client.multi()
      for(let i=0;i<1000;i++){
          pipelineOne.set(`user:${i};action`,`Action ${i}`)
      }
      await pipelineOne.exec()
    
      console.timeEnd('with pipelining')

    } catch (error) {
        console.log(error)
    } finally{
        await client.quit();
        console.log("Connection closed")
    }
}

testRedisConnection()

