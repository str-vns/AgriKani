const { cloudinary } = require("../utils/cloudinary");

const uploadImageMultiple = async (files) => {
    console.log(files)
    return await Promise.all(
      files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          public_id: file.filename,
        });
        return {
          public_id: result.public_id,
          url: result.secure_url,
          originalname: file.originalname,
        };
      })
    );
   }

const uploadImageSingle = async (file) =>
    {
        const result = await cloudinary.uploader.upload(file.path, {
            public_id: file.filename,
          });
          return  {
            public_id: result.public_id,
            url: result.secure_url,
            originalname: file.originalname,
          };
}
 

module.exports = { uploadImageMultiple, uploadImageSingle}