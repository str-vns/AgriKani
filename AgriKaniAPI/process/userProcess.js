const User = require("../models/user");
const Farm = require("../models/farm")
const Product = require("../models/product")
const Otp = require("../models/otp")
const bcrypt = require("bcrypt");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE, GENDER } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const { uploadImageSingle } = require("../utils/imageCloud")
const { cloudinary } = require("../utils/cloudinary");
// NOTE Three DOTS MEANS OK IN COMMENT

//create ...
exports.registerUser = async (req) => {
  console.log("Received File:", req.file);
  const duplicateEmail = await User.findOne({ email: req.body.email })
    .collation({ locale: "en" })
    .lean()
    .exec();

  if (duplicateEmail) throw new ErrorHandler("Email is already exist");

  const phone = req.body.phoneNum;
  if (!phone.match(/^\d{11}$/))
    throw new ErrorHandler("Phone Number must be 11 Digits");
  else if (!phone.startsWith("09"))
    throw new ErrorHandler("Phone Number must be start with 09");
  else if (!phone === STATUSCODE.ZERO)
    throw new ErrorHandler("Phone Number is Required");

  const age = req.body.age;
  if (age < 18 || age > 100)
    throw new ErrorHandler("Age must be between 18 and 100");

  const response = await Otp.findOne({ 
    email: req.body.email,   
    otp: req.body.otp        
  })
  .sort({ createdAt: -1 })      
  .limit(1)                    
  .lean()                      
  .exec();                     

if (!response) {
  throw new ErrorHandler("Otp is not Valid or Email is not Match");
}


  
  let images = {};

  if (req.file) {
    images = await uploadImageSingle(req.file)
  }
  if (!images) throw new ErrorHandler("At least one image is required");

  const role = req.body.roles
    ? Array.isArray(req.body.roles)
      ? req.body.roles
      : req.body.roles.split(", ")
    : [ROLE.CUSTOMER];

  const gender = req.body.gender ? req.body.gender : GENDER.PNTS;
 

  const user = await User.create({
    ...req.body,
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
    .sort({ createdAt: STATUSCODE.NEGATIVE_ONE })
    .lean()
    .exec();

  return users;
};

//Update ...
exports.UpdateUserInfo = async (req, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid User ID: ${id}`);

  const userExist = await User.findById(id).lean().exec();
  if (!userExist) throw new ErrorHandler(`User not exist with ID: ${id}`);
  console.log(userExist?.image?.public_id, "exist image");

  const duplicateUser = await User.findOne({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    _id: { $ne: id },
  })
    .collation({ locale: "en" })
    .lean()
    .exec();
  if (duplicateUser) throw new ErrorHandler("User already Exist");

  let image_img = userExist.image || {};
  if (req.file) {
    image_img = await uploadImageSingle(req.file)
    await cloudinary.uploader.destroy(`${userExist.image.public_id}`);
  }

  if (image_img.length === STATUSCODE.ZERO)
    throw new ErrorHandler("Required to add one image");

  let roles = userExist.roles || req.body.roles;
  if (req.body.roles) {
    roles = Array.isArray(req.body.roles)
      ? req.body.roles
      : req.body.roles.split(", ");
  }

  const updateUser = await User.findByIdAndUpdate(
    id,
    {
      ...req.body,
      roles: roles,
      image: image_img,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .lean()
    .exec();

  if (!updateUser) throw new ErrorHandler(`User not Update with ID ${id}`);
  
  await Product.updateMany(
    { "reviews.user": id }, 
    {
      $set: {
        "reviews.$[elem].avatar": image_img,  
        "reviews.$[elem].firstName": req.body.firstName || userExist.firstName,  
        "reviews.$[elem].lastName": req.body.lastName || userExist.lastName,     
      },
    },
    {
      arrayFilters: [{ "elem.user": id }],  
      new: true,
    }
  ).exec();
  return updateUser;
};

//Delete ...
exports.DeleteUserInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid User ID: ${id}`);

  const userExist = await User.findOne({ _id: id });
  if (!userExist) throw new ErrorHandler(`User not exist with ID: ${id}`);

  const publicIds = userExist.image.public_id;

  await Promise.all([
    User.deleteOne({ _id: id }).lean().exec(),
    cloudinary.uploader.destroy(publicIds),
    Farm.deleteMany({ user: id }).lean().exec(),
    // Products.deleteMany({ user: id}).lean().exec(),
    // Transactions.deleteMany({ user: id}).lean().exec(),
    // Reviews.deleteMany({ user: id}).lean().exec(),
  ]);

  return userExist;
};

//SoftDelete ...
exports.SoftDeleteUserInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid User ID: ${id}`);

  const userExist = await User.findOne({ _id: id });
  if (!userExist) throw new ErrorHandler(`User not exist with ID: ${id}`);

  const softDelUser = await User.findByIdAndUpdate(
    id,
    {
      deletedAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .lean()
    .exec();
  if (!softDelUser) throw new ErrorHandler(`User not SoftDelete with ID ${id}`);
  return softDelUser;
};

//Restore ...
exports.RestoreUserInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid User ID: ${id}`);

  const userExist = await User.findOne({ _id: id });
  if (!userExist) throw new ErrorHandler(`User not exist with ID: ${id}`);

  const restoreUser = await User.findByIdAndUpdate(
    id,
    {
      deletedAt: null,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .lean()
    .exec();
  if (!restoreUser) throw new ErrorHandler(`User was no retrive with ID ${id}`);
  return restoreUser;
};

//Profile ...
exports.ProfileUserInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid User ID: ${id}`);

  const singleUser = await User.findById(id).lean().exec();

  if (!singleUser) throw new ErrorHandler(`User not exist with ID: ${id}`);

  return singleUser;
};
