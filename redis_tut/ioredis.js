const Redis = require('ioredis')

const redis = new Redis()

const demo = async()=>{
    try {
        await redis.set('name','tito')
        const n = await redis.get('name')
        console.log(n)
    } catch (error) {
        console.log(error)
    }finally{
        redis.quit()
    }
}

demo()