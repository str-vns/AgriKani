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
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Product ID: ${id}`);

  const productExist = await Product.findById(id).lean().exec();
  if (!productExist) throw new ErrorHandler(`Product not exist with ID: ${id}`);
console.log(productExist, "Full product object");

if (Array.isArray(productExist.image)) {
 
  productExist.image.forEach((img, index) => {
    console.log(img?.public_id, `Image ${index + 1} public_id`);
  });
} else {
  console.log("productExist.image is not an array, it is:", typeof productExist.image);
}


let image = productExist.image || [];

if (req.files && Array.isArray(req.files)) {
  await Promise.all(
    image.map(async (img, index) => {
      try {
        const result = await cloudinary.uploader.destroy(img.public_id);
        console.log(img?.public_id, `Image ${index + 1} public_id deleted:`, result);
      } catch (error) {
        console.error(`Failed to delete Image ${index + 1}:`, error);
      }
    })
  );
  image = await uploadImageMultiple(req.files);
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
  if (!updateProduct) throw new ErrorHandler(`Product not Update with ID ${id}`);
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
