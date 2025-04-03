const Post = require("../models/Post")

async function invalidatePostCache(req){
    const keys = await req.redisClient.keys("posts:*");
    if(keys.length>0){
        await req.redisClient.del(keys)
    }
}

const createPost = async(req,res)=>{
    try {
        const {content,mediaIds} = req.body
        if(!content)
        return res.status(400).json({success:false,message:'No content Present'})
        const post = await Post.create({
            user: req.user.userId,
            content,
            mediaIds: mediaIds || []
        })

        await invalidatePostCache(req,post._id.toString());

        res.status(201).json({success:true,message:"Post created"});
        
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

const getAllPosts = async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page-1)*limit;

        const cacheKey = `posts:${page}:${limit}`;
        const cachedPosts = await req.redisClient.get(cacheKey)

        if(cachedPosts)
            return res.status(200).json(JSON.parse(cachedPosts))

        const posts = await Post.find({}).sort({createdAt: -1}).skip(startIndex).limit(limit)

        const totalNoOfPosts = await Post.countDocuments()

        const result = {
            posts,
            currentpage: page,
            totalPages: Math.ceil(totalNoOfPosts/limit),
            totalPosts: totalNoOfPosts
        }

        // cache the fetched posts
        await req.redisClient.setex(cacheKey,300,JSON.stringify(result))

        return res.status(200).json(posts)

    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

const getPost = async(req,res)=>{
    try {
        const postId = req.params.id;
        const cacheKey = `post:${postId}`
        const cachedPost = await req.redisClient.get(cacheKey);
        if(cachedPost){
            return res.json(JSON.parse(cachedPosts))
        }
        const postById = await Post.findById({_id:postId});
        
        if(!postById)
            return res.status(404).json({success:false,message:"Post not found"})

        await req.redisClient.setex(cacheKey,3600,JSON.stringify(postById))
        return res.json(postById)

    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

const deletePost = async(req,res)=>{
    try {
        const postId = req.params.id;
        const cacheKey = `post:${postId}`

        const postById = await Post.findOneAndDelete({_id:postId});
        if(!postById)
            return res.status(404).json({success:false,message:"Post not found"})

        await req.redisClient.del(cacheKey)
        return res.status(200).json({success:true,message:"Post deleted!"})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

module.exports = {createPost,getAllPosts,getPost,deletePost}