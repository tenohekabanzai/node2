const Search = require('../models/Search')
const handlePostCreated = async(event)=>{
    try {
        const newSearchPost = await Search.create({
            postId: event.postId,
            userId: event.userId,
            content: event.content,
            createdAt: event.createdAt
        })
        // console.log(newSearchPost)
    } catch (error) {
        console.log(error,"Error while handling Post creation")
    }
}

const handlePostDeleted = async(event)=>{
    try {
        const deletedPost = await Search.findOneAndDelete({postId: event.postId});
        console.log(deletedPost);
    } catch (error) {
        console.log(error,"Error while handling Post deletion")        
    }
}

module.exports = {handlePostCreated,handlePostDeleted};

