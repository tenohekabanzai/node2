const Media = require('../models/Media')
const {uploadMediaToCloudinary} =  require('../utils/cloudinary')
const uploadMedia = async(req,res)=>{
    try {
        console.log("Hello from media controller")
        if(!req.file)
            res.status(400).json({success:false,message:"Add file please"})

        const {originalname,mimetype,buffer} = req.file;
        const userId = req.user.userId;
        console.log(`File Details: ${originalname}, type: ${mimetype}`)
        console.log('Uploading to Cloudinary')
        
        const cloudinaryUploadResult = await uploadMediaToCloudinary(req.file)
        console.log(`Uploaded to Cloudinary ${cloudinaryUploadResult.public_id}`)

        const newMedia = await Media.create({
            publicId: cloudinaryUploadResult.public_id,
            originalName:originalname,
            mimeType:mimetype,
            url: cloudinaryUploadResult.secure_url,
            userId
        })

        return res.status(201).json({success:true,mediaId:newMedia._id,url:newMedia.url,message:"Media upload is successful"})



    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

module.exports = {uploadMedia}