const User = require("../models/user");
const bcrypt = require("bcrypt");
const { ErrorHandler } = require("../utils/success-errorHandler")
//create
exports.registerUser = async (req, res) => {
  const duplicateEmail = await User.findOne({ email: req.body.email })
    .collation({ locale: "en" })
    .lean().exec;

  if (duplicateEmail) throw new ErrorHandler("Email is already exist");

  const avatar_img = req.body.avatar
  if (req.file_image) {
    avatar = await Promise.all(
        req.file_image.map(async (file) =>
        {
            const result =  await cloudinary.uploader.upload(file.path,
             {
                public_id: file.filename,
             });

             return {
                public_id: result.public_id,
                url: result.secure_url,
                originalname: file.originalname,
             };
        })  
    )
  }

  if (avatar_img.length === STATUSCODE.ZERO) 
    throw new ErrorHandler("Required to add one image");

  const roles = req.body.roles 
  ? Array.isArray(req.body.roles)
   ? req.body.roles 
  : req.body.roles.split(", ")
  : [ROLE.CUSTOMER];

  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, Number(process.env.SALT)),
    roles: roles,
    avatar: avatar_img
  });

  return user;
};
export default userProcess;
