const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const { cloudinary } = require("../utils/Cloudinary");

// NOTE Three DOTS MEANS OK IN COMMENT

//create ...
exports.CreateProductProcess = async (req) => {
  console.log("Received File:", req.files);
  
  const stock = req.body.stock
  if (stock < 1 || stock >200)
    throw new ErrorHandler("Stock must be between 1 and 200")
 

  let image = [];
  if (req.files && Array.isArray(req.files)) {
    image = await Promise.all(
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

  if (image.length === STATUSCODE.ZERO)
    throw new ErrorHandler("At least one image is required");

  const product = await Product.create({
    ...req.body,
    image: image,
  });

  return product;
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
    const file = req.file;
    const result = await cloudinary.uploader.upload(file.path, {
      public_id: file.filename,
    });
    image_img = {
      public_id: result.public_id,
      url: result.secure_url,
      originalname: file.originalname,
    };
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
      deletedAt: "true",
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
      deletedAt: "false",
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .lean()
    .exec();
  if (!restoreUser) throw new ErrorHandler(`User not SoftDelete with ID ${id}`);
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
