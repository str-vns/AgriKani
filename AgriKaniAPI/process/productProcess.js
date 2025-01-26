const Product = require("../models/product");
const Farm = require("../models/farm");
const Order = require("../models/order");
const Inventory = require("../models/inventoryM");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const { cloudinary } = require("../utils/cloudinary");
const { uploadImageMultiple } = require("../utils/imageCloud")
// NOTE Three DOTS MEANS OK IN COMMENT

//create ...
exports.CreateProductProcess = async (req) => {
  console.log("Received File:", req.files);
  console.log(req.body.user);  
  // const stock = req.body.stock
  // if (stock < 1 || stock >200)
  //   throw new ErrorHandler("Stock must be between 1 and 200")
 
  const coopId = await Farm.findOne({ user: req.body.user }).lean().exec();
  
  let image = [];
  if (req.files && Array.isArray(req.files)) {
    image = await uploadImageMultiple(req.files)
  }

  if (image.length === STATUSCODE.ZERO)
    throw new ErrorHandler("At least one image is required");

  const product = await Product.create({
    productName: req.body.productName,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    type: req.body.type,
    coop: coopId._id,
    image: image,
  });

  return product;
};

//Read ...
exports.GetAllProdductInfo = async () => {
  const products = await Product.find({ deletedAt: null, activeAt: 'active' })
  .populate({path: "reviews.user", select: "firstName lastName image.url"})
  .populate({path: "stock", select: "quantity metricUnit unitName price status", options: { sort: { createdAt: -1 } }, match: { quantity: { $gt: 0 } }})
  .populate({path: "coop", select: "user"})
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

  let image = productExist.image || [];

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const newImages = await uploadImageMultiple(req.files);

    image = [...image, ...newImages];
  }

  const updateProduct = await Product.findByIdAndUpdate(
    id,
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
    Inventory.deleteMany({ productId: id }).lean().exec(),
    Order.updateMany({ "orderItems.product": id }, { $pull: { orderItems: { product: id } } }).lean().exec(),
    User.updateMany({"wishlist.product": id}, { $pull: { wishlist: { product: id } } }).lean().exec(),
    cloudinary.uploader.destroy(publicIds),
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
      activeAt: 'inactive',
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

  const singleProduct = await Product.findById(id)
  .populate({path: "stock", select: "quantity metricUnit unitName price status"})
  .populate({path: "reviews.user", select: "firstName lastName image.url"})
  .lean().exec();

  if (!singleProduct) throw new ErrorHandler(`Product not exist with ID: ${id}`);

  return singleProduct;
};

exports.CoopOnlyProduct = async (id) => {
  console.log("User ID:", id);
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid User ID: ${id}`);
  
  const coopId = await Farm.findOne({ user: id }).lean().exec();
  const coopOnlyProduct = await Product.find({ coop: coopId._id, deletedAt: null })
  .populate({path: "reviews.user", select: "firstName lastName image.url"})
  .populate({path: "stock", select: "quantity metricUnit unitName price status"})
  .lean().exec();

  if (!coopOnlyProduct) throw new ErrorHandler(`Product not exist with ID: ${id}`);

  return coopOnlyProduct;
};

exports.CoopOnlyArchiveProduct = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid User ID: ${id}`);

  const coopId = await Farm.findOne({ user: id }).lean().exec(); 

  const coopOnlyArchiveProduct = await Product.find({ coop: coopId._id, deletedAt:  { $ne: null } }).lean().exec();

  if (!coopOnlyArchiveProduct) throw new ErrorHandler(`Product not exist with ID: ${id}`);

  return coopOnlyArchiveProduct;
};

exports.deleteImage = async (id, imageId) => {
  console.log("Product ID:", id);
  console.log("Image ID:", imageId);

  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Product ID: ${id}`);

  const singleProduct = await Product.findById(id).lean().exec();
  if (!singleProduct) throw new ErrorHandler(`Product does not exist with ID: ${id}`);

  const imageToDelete = singleProduct.image.find(img => img._id.toString() === imageId);
  if (!imageToDelete) {
    throw new ErrorHandler(`Image with ID: ${imageId} does not exist in the product.`);
  }

  await cloudinary.uploader.destroy(imageToDelete.public_id);

  await Product.updateOne(
    { _id: id },
    { $pull: { image: { _id: imageId } } }
  );

  console.log('Image deleted successfully');
  return { message: 'Image deleted successfully' };
}

exports.activeProduct = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Product ID: ${id}`);

  const activeProduct = await Product.findByIdAndUpdate(
    id,
    {
      activeAt: 'active',
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .lean()
    .exec();
  if (!activeProduct) throw new ErrorHandler(`Product not active with ID ${id}`);
  return activeProduct;
}

exports.getRankedProducts = async (req, res, next) => {
  try {
    const rankedProducts = await Product.aggregate([
      // Group by productId and sum the quantities
      { 
        $group: { 
          _id: "$productId", 
          totalQty: { $sum: "$quantity" } 
        }
      },
      // Lookup the product details to get the name and total quantity sold
      { 
        $lookup: {
          from: 'products', // Assuming the collection is called 'products'
          localField: '_id', // Match on the _id field of the productId
          foreignField: '_id', // Match the productId with the _id of the products collection
          as: 'productDetails' // The resulting array with product details
        }
      },
      // Unwind the array so we can access the name and other details easily
      { 
        $unwind: {
          path: "$productDetails", 
          preserveNullAndEmptyArrays: true // Keep even if there's no matching product
        }
      },
      // Project the final output, including name and totalQty
      { 
        $project: {
          productId: "$_id", // Keep the productId
          name: "$productDetails.name", // Get the name of the product
          totalQty: 1 // Keep total quantity
        }
      },
      // Sort by total quantity in descending order
      { 
        $sort: { totalQty: -1 } 
      }
    ]);

    res.status(200).json({
      success: true,
      rankedProducts: rankedProducts,
    });
  } catch (error) {
    next(error); // Pass error to the next middleware for handling
  }
};

