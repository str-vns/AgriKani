const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const { cloudinary } = require("../utils/cloudinary");
const { uploadImageMultiple } = require("../utils/imageCloud")
// NOTE Three DOTS MEANS OK IN COMMENT

//create ...
exports.CreateProductProcess = async (req) => {
  console.log("Received File:", req.files);
  
  const stock = req.body.stock
  if (stock < 1 || stock >200)
    throw new ErrorHandler("Stock must be between 1 and 200")
 

  let image = [];
  if (req.files && Array.isArray(req.files)) {
    image = await uploadImageMultiple(req.files)
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
exports.GetAllProdductInfo = async () => {
  const products = await Product.find()
    .sort({ createdAt: STATUSCODE.NEGATIVE_ONE })
    .lean()
    .exec();

  return products;
};

//Update ...
exports.UpdateProductInfo = async (req, id) => {
  console.log("Received File:", req.files);
  console.log(req.body);

  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Product ID: ${id}`);

  // Check if the product exists
  const productExist = await Product.findById(id).lean().exec();
  if (!productExist) throw new ErrorHandler(`Product not exist with ID: ${id}`);
  
  console.log(productExist, "Full product object");

  // Check if image field exists and is an array
  if (Array.isArray(productExist.image)) {
    productExist.image.forEach((img, index) => {
      console.log(img?.public_id, `Image ${index + 1} public_id`);
    });
  } else {
    console.log("productExist.image is not an array, it is:", typeof productExist.image);
  }

  // Start with existing images
  let image = productExist.image || [];

  // If there are new files in the request, add them to the existing images
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    // Assuming uploadImageMultiple handles the new images and returns their URIs
    const newImages = await uploadImageMultiple(req.files);

    // Merge new images with existing images
    image = [...image, ...newImages];
  }

  // Update the product in the database
  const updateProduct = await Product.findByIdAndUpdate(
    id,
    {
      ...req.body,
      image: image, // Save the merged images (old + new)
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .lean()
    .exec();

  if (!updateProduct) throw new ErrorHandler(`Product not updated with ID ${id}`);
  
  return updateProduct;
};

//Delete ...
exports.DeleteProductInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Product ID: ${id}`);

  const productExist = await Product.findOne({ _id: id });
  if (!productExist) throw new ErrorHandler(`Product not exist with ID: ${id}`);

  const publicIds = productExist.image.public_id;

  await Promise.all([
    Product.deleteOne({ _id: id }).lean().exec(),
    cloudinary.uploader.destroy(publicIds),
    // Category.deleteMany({ product: id}).lean().exec(),
    // Type.deleteMany({ product: id}).lean().exec(),
  ]);

  return productExist;
};

//SoftDelete ...
exports.SoftDeleteProductInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Product ID: ${id}`);

  const productExist = await Product.findOne({ _id: id });
  if (!productExist) throw new ErrorHandler(`Product not exist with ID: ${id}`);

  const softDelProduct = await Product.findByIdAndUpdate(
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
  if (!softDelProduct) throw new ErrorHandler(`Product not SoftDelete with ID ${id}`);
  return softDelProduct;
};

//Restore ...
exports.RestoreProductInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Product ID: ${id}`);

  const productExist = await Product.findOne({ _id: id });
  if (!productExist) throw new ErrorHandler(`Product not exist with ID: ${id}`);

  const restoreProduct = await Product.findByIdAndUpdate(
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
  if (!restoreProduct) throw new ErrorHandler(`Product was not retrive with ID ${id}`);
  return restoreProduct;
};

//Single Product ...
exports.singleProduct = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Product ID: ${id}`);

  const singleProduct = await Product.findById(id).lean().exec();

  if (!singleProduct) throw new ErrorHandler(`Product not exist with ID: ${id}`);

  return singleProduct;
};

exports.CoopOnlyProduct = async (id) => {
  console.log("User ID:", id);
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid User ID: ${id}`);

  const coopOnlyProduct = await Product.find({ user: id, deletedAt: null }).lean().exec();

  if (!coopOnlyProduct) throw new ErrorHandler(`Product not exist with ID: ${id}`);

  return coopOnlyProduct;
};

exports.CoopOnlyArchiveProduct = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid User ID: ${id}`);

  const coopOnlyArchiveProduct = await Product.find({ user: id, deletedAt:  { $ne: null } }).lean().exec();

  if (!coopOnlyArchiveProduct) throw new ErrorHandler(`Product not exist with ID: ${id}`);

  return coopOnlyArchiveProduct;
};

exports.deleteImage = async (id, imageId) => {
  console.log("Product ID:", id);
  console.log("Image ID:", imageId);
  // Check if the provided product ID is valid
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Product ID: ${id}`);

  // Find the product by ID
  const singleProduct = await Product.findById(id).lean().exec();
  if (!singleProduct) throw new ErrorHandler(`Product does not exist with ID: ${id}`);

  // Find the image to delete by its _id
  const imageToDelete = singleProduct.image.find(img => img._id.toString() === imageId);
  if (!imageToDelete) {
    throw new ErrorHandler(`Image with ID: ${imageId} does not exist in the product.`);
  }

  // Delete the image from Cloudinary
  await cloudinary.uploader.destroy(imageToDelete.public_id);

  // Remove the image from the product's image array
  await Product.updateOne(
    { _id: id },
    { $pull: { image: { _id: imageId } } }
  );

  console.log('Image deleted successfully');
  return { message: 'Image deleted successfully' };
}