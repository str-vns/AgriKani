const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const { cloudinary } = require("../utils/cloudinary");
const { uploadImageMultiple } = require("../utils/imageCloud")
const Farm = require("../models/farm")
const User = require("../models/user")
const Orders = require("../models/order");
const user = require("../models/user");
// NOTE Three DOTS MEANS OK IN COMMENT

//create ...
exports.CreateFarmProcess = async (req) => {
  
    const duplicateFarm = await Farm.findOne({ farmName: req.body.farmName })
    .collation({ locale: "en" })
    .lean()
    .exec();
  if (duplicateFarm) throw new ErrorHandler("Farm Name is already exist");
 
  const user = await User.findById(req.body.user).exec(); 
  if (!user) throw new ErrorHandler("User not found");
  
  if (!user.roles.includes(ROLE.COOPERATIVE)) {
      user.roles.push(ROLE.COOPERATIVE); 
      await user.save();
  }

  let image = [];
  if (req.files && Array.isArray(req.files)) {
    image = await uploadImageMultiple(req.files)
  }

  if (image.length === STATUSCODE.ZERO)
    throw new ErrorHandler("At least one image is required");

  const farm = await Farm.create({
    ...req.body,
    image: image,
  });

  return farm;
};

//Read ...
exports.GetAllFarm = async () => {
  const farm = await Farm.find()
    .populate({ path: "user", select: "firstName lastName email image.url" })
    .sort({ createdAt: STATUSCODE.NEGATIVE_ONE })
    .lean()
    .exec();

  return farm;
};

//Update ...
exports.UpdateFarmInfo = async (req, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Farm ID: ${id}`);

  const farmExist = await Farm.findById(id).lean().exec();
  if (!farmExist) throw new ErrorHandler(`Farm not exist with ID: ${id}`);
console.log(farmExist, "Full Farm object");

if (Array.isArray(farmExist.image)) {
    farmExist.image.forEach((img, index) => {
    console.log(img?.public_id, `Image ${index + 1} public_id`);
  });
} else {
  console.log("farmExist.image is not an array, it is:", typeof farmExist.image);
}


let image = farmExist.image || [];
 
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const newImages = await uploadImageMultiple(req.files);
    image = [...image, ...newImages];
  }

  const updateFarm = await Farm.findByIdAndUpdate(
    farmExist._id,
    {
      ...req.body,
      image: image,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .lean()
    .exec();
  if (!updateFarm) throw new ErrorHandler(`Farm not Update with ID ${id}`);
  return updateFarm;
};

//Delete ...
exports.DeleteFarmInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Farm ID: ${id}`);

  const farmExist = await Farm.findOne({ _id: id });
  if (!farmExist) throw new ErrorHandler(`Farm not exist with ID: ${id}`);

  const publicIds = farmExist.image.public_id;

  await Promise.all([
    Farm.deleteOne({ _id: id }).lean().exec(),
    cloudinary.uploader.destroy(publicIds),
    // Category.deleteMany({ product: id}).lean().exec(),
    // Type.deleteMany({ product: id}).lean().exec(),
  ]);

  return farmExist;
};

//SoftDelete ...
exports.SoftDeleteFarmInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Farm ID: ${id}`);

  const farmExist = await Farm.findOne({ _id: id });
  if (!farmExist) throw new ErrorHandler(`Farm not exist with ID: ${id}`);

  const softDelFarm = await Farm.findByIdAndUpdate(
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
  if (!softDelFarm) throw new ErrorHandler(`Farm not SoftDelete with ID ${id}`);
  return softDelFarm;
};

//Restore ...
exports.RestoreFarmInfo = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ErrorHandler(`Invalid Farm ID: ${id}`);

    const farmExist = await Farm.findOne({ _id: id });
    if (!farmExist) throw new ErrorHandler(`Farm not exist with ID: ${id}`);

  const restoreFarm = await Farm.findByIdAndUpdate(
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
  if (!restoreFarm) throw new ErrorHandler(`Farm was not retrive with ID ${id}`);
  return restoreFarm;
};

//Single Product ...
exports.singleFarm = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Farm ID: ${id}`);

  const singleFarm = await Farm.findById(id)
  .populate({path: "user",select: "firstName lastName email image.url"} ).lean().exec();

  if (!singleFarm) throw new ErrorHandler(`Product not exist with ID: ${id}`);

  return singleFarm;
};

exports.FarmDeleteImage = async (farmId, imageId) => {

    if (!mongoose.Types.ObjectId.isValid(farmId)) {
      throw new ErrorHandler(`Invalid Farm ID: ${farmId}`);
    }
  
    const farmExist = await Farm.findById(farmId).lean().exec();
    if (!farmExist) {
      throw new ErrorHandler(`Farm not exist with ID: ${farmId}`);
    }
  
    const imageToDelete = farmExist.image.find(img => img._id.toString() === imageId);
    if (!imageToDelete || !imageToDelete.public_id) {
      throw new ErrorHandler(`Image with ID: ${imageId} does not exist or does not have a public_id.`);
    }
  
    const publicId = imageToDelete.public_id;
  
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new ErrorHandler(`Cloudinary deletion failed: ${error.message}`);
    }
  
    await Farm.updateOne(
      { _id: farmId },
      { $pull: { image: { _id: imageId } } }
    );
  
    return Farm.findById(farmId).exec();
  };


exports.CoopOrders = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Farm ID: ${id}`);
  
   const orders = await Orders.find({ "orderItems.productUser": id })
   .populate({ path: "user", select: "firstName lastName image.url" })
   .populate({ path: "orderItems.product", select: "productName image.url pricing" })
   .populate({ path: "shippingAddress", select: "address city" })
 

  let totalPrice = 0;
  orders.forEach(order => {
    const orderTotal = order.orderItems.reduce((sum, item) => {
      return sum + (item.price || 0);
    }, 0);

    totalPrice += orderTotal; 
  });
  return orders;
};

exports.coopSingle = async (id) => {
  
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Farm ID: ${id}`);

  const singleCoop = await Farm.findOne({ user: id })
  .populate({path: "user",select: "firstName lastName email image.url"} ).lean().exec();

  if (!singleCoop) throw new ErrorHandler(`Product not exist with ID: ${id}`);

  return singleCoop;
}