const express = require('express')
const {createTable,insertUser,getAllUsers, deleteUser, getUserbyUsername,updateEmail} = require('./concepts/basic_queries')
const { getUsersWhere, getUsersSorted, getPaginatedUsers } = require('./concepts/filter_sort')
const { createPostTable, insertPost } = require('./concepts/relationships')
const { getUsersWithPosts, getAllUsersWithPosts } = require('./concepts/joins')
const { countPostsByUser } = require('./concepts/aggregation')
const app = express()


const connectToDB = async()=>{
    try {
        await createTable()
        // await insertUser('xyzDoe','jxyzdoe@gmail.com')
    } catch (error) {
        console.log("Error occured while querying")
        console.log(error)
    }
}

app.use(express.json());

connectToDB()

const g1 = async()=>{
    const resp  = await getUsersWhere(`username like 'use%';`)
    console.log(resp)
}
const g2=async()=>{
    const resp  =await getUsersSorted('username','desc')
    console.log(resp)
}
const g3=async()=>{
    const resp =await getPaginatedUsers(3,1);
    console.log(resp)
}

// createPostTable();

getUsersWithPosts();
getAllUsersWithPosts();
countPostsByUser()

app.get('/user',async(req,res)=>{
    const resp = await getAllUsers();
    console.log(resp)
    res.json(resp);
})

app.get('/user/:username',async(req,res)=>{
    const username = req.params.username
    try {
        const resp = await getUserbyUsername(username)
        res.status(200).json(resp)
    } catch (error) {
        console.log(error)
    }
})

app.post('/user',async(req,res)=>{
    const {username,email} = req.body;
    if(!username||!email)
    return res.status(404);
    
    try {
        const resp = await insertUser(username,email)
        console.log(resp);
        res.status(200).json(resp);   
    } catch (error) {
        console.log(error)
    }
})

app.put('/user/change_email/:username',async(req,res)=>{
    const {email} = req.body;
    const username = req.params.username
    // console.log(username,email)
    try {
        const resp = await updateEmail(username,email)
        res.status(200).json(resp)
    } catch (error) {
        console.log(error)
    }
})

app.delete('/user/:username',async(req,res)=>{
    const username = req.params.username;
    try {
        const resp =await deleteUser(username);
        res.status(200).send(resp)   
    } catch (error) {
        console.log(error)
    }
})

app.post('/post',async(req,res)=>{
    const {title,content,userId} = req.body;
    const resp = await insertPost(title,content,userId)
    console.log(resp);
    res.status(200).send(resp);
})

app.listen(3000,()=>{
    console.log('app running on Port 3000')
})