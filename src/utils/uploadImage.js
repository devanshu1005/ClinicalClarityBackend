const cloudinary = require("../config/cloudinary");

const uploadImage = (buffer, folder) => {
  console.log("Loading Cloudinary...");
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve(result);
        }
      )
      .end(buffer);
  });
};

module.exports = uploadImage;