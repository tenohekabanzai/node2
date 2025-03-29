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



        console.log("---------------------------STRINGS------------------")
       // Strings-> SET,GET,MSET,MGET
       await client.set("user:name","Abc")
       const name = await client.get('user:name')
       console.log(name)

       await client.mSet(["user:email","abc@gmai.com","user:age","45","user:country","Bharat"])
       const [email,age,country] = await client.mGet(['user:email','user:age','user:country'])
       console.log(email,age,country)




       console.log("---------------------------LISTS------------------")
       // lists -> LPUSH, RPUSH, LRANGE, LPOP, RPOP
       await client.lPush('notes',['note1','note2','note3'])
       let extractAll = await client.lRange('notes',0,-1)
       console.log(extractAll)

       const leftmost_elem = await client.lPop('notes')
       console.log(leftmost_elem)

       const rightmost_elem = await client.rPop('notes')
       console.log(rightmost_elem)

       extractAll = await client.lRange('notes',0,-1)
       console.log(extractAll)



       console.log("--------------------SETS---------------------------")
       // sets -> SADD,SMEMBERS,SISMEMBER, SREM

       // add member
       await client.sAdd('user:nickname',['john','varun','xyz'])
       let extractNN = await client.sMembers('user:nickname')
       console.log(extractNN)

       // check if member present
       const checkMember = await client.sIsMember('user:nickname','varun')
       console.log(checkMember)

       // removing member
       await client.sRem("user:nickname",'xyz')
       extractNN = await client.sMembers('user:nickname')
       console.log(extractNN)




       console.log("----------------------SORTED SETS---------------------------")
       // ZADD,ZRANGE,ZRANK,ZREM
       await client.zAdd('cart',[
        {score:100,value:'B'},
        {score:150,value:'C'},
        {score:20,value:'A'}])

        // sort in asc order
        const AscOrder = await client.zRange("cart",0,-1)
        console.log(AscOrder)

        const AscOrder_sc = await client.zRangeWithScores("cart",0,-1)
        console.log(AscOrder_sc)

        const DescOrder = await client.zRange("cart",0,-1,{REV:true})
        console.log(DescOrder)

        const DescOrder_sc = await client.zRangeWithScores("cart",0,-1,{REV:true})
        console.log(DescOrder_sc)

        let cartRank = await client.zRank("cart","A")
        console.log(cartRank)
        cartRank = await client.zRank("cart","B")
        console.log(cartRank)
        cartRank = await client.zRank("cart","C")
        console.log(cartRank)


       console.log("--------------------------HASHES------------------------")
       // HSET, HGET, HGETALL, HDEL
       
       await client.hSet('product:1',{name: 'Product 1',description: 'p1 desc',rating:5})
       await client.hSet('product:2',{name: 'Product 2',description: 'p2 desc',rating:4.5})
       
       
       // get one field
       const getRating = await client.hGet('product:1','rating')
       console.log(getRating)
       

       // ge all  fields
       let getProductDetails = await client.hGetAll('product:2')
       console.log(getProductDetails)

       // delete a fiels
       await client.hDel('product:2','description')
       getProductDetails = await client.hGetAll('product:2')
       console.log(getProductDetails)

       console.log("--------------------------------------------------")


    } catch (error) {
        console.log(error)
    } finally{
        await client.quit();
        console.log("Connection closed")
    }
}

testRedisConnection()

