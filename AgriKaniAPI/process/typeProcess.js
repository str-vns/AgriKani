const Type = require("../models/type");
const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const { cloudinary } = require("../utils/cloudinary");
const { uploadImageMultiple } = require("../utils/imageCloud")
// NOTE Three DOTS MEANS OK IN COMMENT

//create ...
exports.CreateType = async (req) => {
  console.log("Received File:", req.files);

  const type = await Type.create({
    ...req.body,
  });

  return type;
};

//Read ...
exports.GetType = async () => {
  const type = await Type.find()
    .sort({ createdAt: STATUSCODE.NEGATIVE_ONE })
    .lean()
    .exec();

  return type;
};

//Update ...
exports.UpdateType= async (req, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Type ID: ${id}`);

  const typeExist = await Type.findById(id).lean().exec();
  if (!typeExist) throw new ErrorHandler(`Type not exist with ID: ${id}`);
// console.log(categoryExist, "Full product object");

  const updateType = await Type.findByIdAndUpdate(
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
  if (!updateType) throw new ErrorHandler(`Type not Update with ID ${id}`);
  return updateType;
};

//Delete ...
exports.DeleteType = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Type ID: ${id}`);

  const typeExist = await Type.findOne({ _id: id });
  if (!typeExist) throw new ErrorHandler(`Type not exist with ID: ${id}`);


  await Promise.all([
    Type.deleteOne({ _id: id }).lean().exec(),
    Product.deleteMany({ type : id}).lean().exec(),
    // Type.deleteMany({ product: id}).lean().exec(),
  ]);

  return typeExist;
};
