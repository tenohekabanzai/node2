const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'drtru6ul8',
    api_key: '731771349492685',
    api_secret: 'DQBJYbXjqQ441bj_WtPwGyhvInc',
})

const uploadMediaToCloudinary = (file)=>{
    return new Promise((resolve,reject)=>{
        const uploadStream = cloudinary.upload.upload_stream({resource_type: "auto",},(error,result)=>{
            if(error){
                console.log(error)
                reject(error)
            } else {
                resolve(result)
            }
        })
        uploadStream.end(file.buffer)
    })
}

module.exports = {uploadMediaToCloudinary}