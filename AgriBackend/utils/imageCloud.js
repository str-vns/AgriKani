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
   
const uploadImageMultipleDel = async (files) =>
    {
       return await Promise.all(
            files.map(async (file) => {
              const result = await cloudinary.uploader.upload(file.path, {
                public_id: file.filename,
              });
      
              image.forEach((img, index) => {
                   cloudinary.uploader.destroy(img.public_id)
                console.log(img?.public_id, `Image ${index + 1} public_id`);
              });
              
              return {
                public_id: result.public_id,
                 url: result.secure_url,
                originalname: file.originalname,
              };
              
            })
            
          );
}
module.exports = { uploadImageMultiple, uploadImageSingle, uploadImageMultipleDel}