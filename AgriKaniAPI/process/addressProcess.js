const Address = require("../models/address")
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE } = require("../constants/index");
const { default: mongoose } = require("mongoose");

// NOTE Three DOTS MEANS OK IN COMMENT

//create ...
exports.CreateAddressProcess = async (req) => {
  
  const address = await Address.create({
    ...req.body,
  });

  return address;
};

//Read ...
exports.GetAllAddressInfo = async () => {
  const address = await Address.find()
    .populate({ path: "userId", select: "firstName lastName email image.url phoneNum" })
    .sort({ createdAt: STATUSCODE.NEGATIVE_ONE })
    .lean()
    .exec();

  return address;
};

//Update ...
exports.UpdateAddressInfo = async (req, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Address ID: ${id}`);

  const addressExist = await Address.findById(id).lean().exec();
  if (!addressExist) throw new ErrorHandler(`Address not exist with ID: ${id}`);
console.log(addressExist, "Full Address object");

  const updateAddress = await Address.findByIdAndUpdate(
    id,
    {
      ...req.body,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .lean()
    .exec();
  if (!updateAddress) throw new ErrorHandler(`Address not Update with ID ${id}`);
  return updateAddress;
};

//Delete ...
exports.DeleteAddressInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Address ID: ${id}`);

  const addressExist = await Address.findOne({ _id: id });
  if (!addressExist) throw new ErrorHandler(`Address not exist with ID: ${id}`);

  await Promise.all([
    Address.deleteOne({ _id: id }).lean().exec(),
    // Transaction.deleteMany({ AddressId: id}).lean().exec(),
    // Shipping.deleteMany({ AddressId: id}).lean().exec(),
  ]);

  return addressExist;
};

//Single addresss ...
exports.singleAddress = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Address ID: ${id}`);

  const addressProduct = await Address.find({ userId: id})
  .populate({ path: "userId", select: "firstName lastName email image.url phoneNum" })
  .lean().exec();

  if (!addressProduct) throw new ErrorHandler(`Address not exist with ID: ${id}`);

  return addressProduct;
};

exports.singleAddressId = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Address ID: ${id}`);

  const addressProduct = await Address.findById(id)
  .populate({ path: "userId", select: "firstName lastName email image.url phoneNum" })
  .lean().exec();

  console.log(addressProduct, "Single Address object");
  if (!addressProduct) throw new ErrorHandler(`Address not exist with ID: ${id}`);

  return addressProduct;
}
