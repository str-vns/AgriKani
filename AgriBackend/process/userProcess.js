const User = require("../models/user");
const bcrypt = require("bcrypt");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE, GENDER } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const { cloudinary } = require("../utils/Cloudinary");

// NOTE Three DOTS MEANS OK IN COMMENT

//create ...
exports.registerUser = async (req) => {
  const duplicateEmail = await User.findOne({ email: req.body.email })
    .collation({ locale: "en" })
    .lean().exec();

  if (duplicateEmail) throw new ErrorHandler("Email is already exist");

  const phone = req.body.phoneNum
  if (!phone.match(/^\d{11}$/))
    throw new ErrorHandler("Phone Number must be 11 Digits")
  else if (!phone.startsWith("09"))
    throw new ErrorHandler("Phone Number must be start with 09")
  else if (!phone === STATUSCODE.ZERO)
    throw new ErrorHandler("Phone Number is Required")

  const age  = req.body.age
  if (age < 18 || age > 100)
    throw new ErrorHandler("Age must be between 18 and 100")

  let images = [];
  if (req.files && Array.isArray(req.files)) {
    images = await Promise.all(
      req.files.map(async (file) => {
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

  if (images.length === STATUSCODE.ZERO)
    throw new ErrorHandler("At least one image is required");

  const role = req.body.roles
    ? Array.isArray(req.body.roles)
      ? req.body.roles
      : req.body.roles.split(", ")
    : [ROLE.CUSTOMER];

    const gender = req.body.gender
      ? req.body.gender
    : GENDER.PNTS;

  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    age: req.body.age,
    phoneNum: req.body.phoneNum,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, Number(process.env.SALT)),
    roles: role,
    gender: gender,
    image: images,
  });

  return user;
};

//Read ...
exports.GetAllUserInfo = async () => {
  const users = await User.find()
  .sort({createdAt: STATUSCODE.NEGATIVE_ONE}).lean().exec();
  
  return users;
}

//Update
exports.UpdateUserInfo = async (req, ) => {
  if(!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid User ID: ${id}` );
  
  const userExist = await User.findById(id).lean().exec()
  if(!userExist) throw new ErrorHandler(`User not exist with ID: ${id}`)

  const duplicateUser = await User.findOne(
    { firstName: req.body.firstName,
      lastName: req.body.lastName,
      _id: {$ne: id},
    })
    .collation({ locale: "en"})
    .lean()
    .exec();

    if(duplicateUser) throw new ErrorHandler("User already Exist")

let image_img = userExist.image || [];
if (req.files) {
  image_img = await Promise.all(
    req.files.map(async (file) => {
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

if (image_img.length === STATUSCODE.ZERO)
  throw new ErrorHandler("Required to add one image");

let roles = userExist.roles || req.body.roles
if(req.body.roles) {
  roles = Array.isArray(req.body.roles)
  ? req.body.roles
  : req.body.roles.split(", ");
}

const updateUser = await User.findByIdAndUpdate(id, {
 ...req.body,
 roles: roles,
 image: image_img
},
{
  new: true,
  runValidators: true
})
.lean()
.exec()
;

if(!updateUser) throw new ErrorHandler(`User not Update with ID ${id}`)
return updateUser;
}

//Delete
exports.DeleteUserInfo = async (id) => {
  if(!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid User ID: ${id}`)

  const userExist = await User.findOne({ _id: id })
  if(!userExist) throw new ErrorHandler(`User not exist with ID: ${id}`)

    const publicIds = userExist.avatar.map((avatar) => avatar.public_id)
    
    await Promise.all(
      User.deleteOne({ _id: id}).lean().exec(),
      cloudinary.uploader.destroy(publicIds),
      // Products.deleteMany({ user: id}).lean().exec(),
      // Transactions.deleteMany({ user: id}).lean().exec(),
      // Reviews.deleteMany({ user: id}).lean().exec(),
    )

      return userExist
}