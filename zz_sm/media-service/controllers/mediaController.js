const uploadMedia = async(req,res)=>{
    try {
        if(!req.file)
            res.status(400).json({success:false,message:"Add file please"})

        const {originalName,mimeType,buffer} = req.file;
        const userId = req.user.userId;
        console.log(`File Details: ${originalName}, type: ${mimeType}`)
        console.log('Uploading to Cloudinary')

        const cloudinaryUploadResult = await uploadMediaToCloudinary(req.file)

    } catch (error) {
        console.log(error)
        res.send(500).json({succcess:false,message:"Internal Server Error"})
    }
}

module.exports = {uploadMedia}