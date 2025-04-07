const Media = require("../models/Media")
const { deleteMediaFromCloudinary } = require("../utils/cloudinary")

const handlePostDeleted = async(event)=>{
    console.log(event,"event occured")
    const {postId,mediaIds} = event
    try {
        const media = await Media.find({_id: {$in: mediaIds}})
        for(const i of media)
        {
            await deleteMediaFromCloudinary(i.publicId)
            await Media.findByIdAndDelete(i._id)
            console.log(`Deleted media ${i._id} associated with ${postId}`)
        }

        console.log('Deletion completed')

    } catch (error) {
        console.log(error,'Error occured while media deletion')
    }
}

module.exports = {handlePostDeleted}