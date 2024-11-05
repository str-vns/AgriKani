const Category = require("../models/category");
const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const { cloudinary } = require("../utils/cloudinary");
const { uploadImageSingle } = require("../utils/imageCloud")
// NOTE Three DOTS MEANS OK IN COMMENT

//create ...
exports.CreateCategory = async (req) => {
  console.log("Received File:", req.file);

  let image = {};
  if (req.file) {
    image = await uploadImageSingle(req.file)
  }
  if (!image) throw new ErrorHandler("At least one image is required");

  const category = await Category.create({
    ...req.body,
    image: image,
  });

  return category;
};

//Read ...
exports.GetCategory = async () => {
  const category = await Category.find()
    .sort({ createdAt: STATUSCODE.NEGATIVE_ONE })
    .lean()
    .exec();

  return category;
};

//Update ...
exports.UpdateCategory= async (req, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Category ID: ${id}`);

  const categoryExist = await Category.findById(id).lean().exec();
  if (!categoryExist) throw new ErrorHandler(`Category not exist with ID: ${id}`);
// console.log(categoryExist, "Full product object");

let image_img = userExist.image || {};
if (req.file) {
  image_img = await uploadImageSingle(req.file)
  await cloudinary.uploader.destroy(`${userExist.image.public_id}`);
}

if (image_img.length === STATUSCODE.ZERO)
  throw new ErrorHandler("Required to add one image");


  const updateCategory = await Product.findByIdAndUpdate(
    id,
    {
      ...req.body,
      image: image_img,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .lean()
    .exec();
  if (!updateCategory) throw new ErrorHandler(`Category not Update with ID ${id}`);
  return updateCategory;
};

//Delete ...
exports.DeleteCategory = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Product ID: ${id}`);

  const categoryExist = await Category.findOne({ _id: id });
  if (!categoryExist) throw new ErrorHandler(`Category not exist with ID: ${id}`);

  const publicIds = categoryExist.image.public_id;

  await Promise.all([
    Category.deleteOne({ _id: id }).lean().exec(),
    cloudinary.uploader.destroy(publicIds),
    Product.deleteMany({ category: id}).lean().exec(),
    // Type.deleteMany({ product: id}).lean().exec(),
  ]);

  return categoryExist;
};



