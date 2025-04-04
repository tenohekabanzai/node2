const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "drtru6ul8",
  api_key: "731771349492685",
  api_secret: "DQBJYbXjqQ441bj_WtPwGyhvInc",
});

const uploadMediaToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(file.buffer);
  });
};

const deleteMediaFromCloudinary = async(publicId)=>{
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    console.log("Media Deleted from cloudinary",publicId)
    return result
  } catch (error) {
    console.log(error)
  }
}

module.exports = { uploadMediaToCloudinary,deleteMediaFromCloudinary };
