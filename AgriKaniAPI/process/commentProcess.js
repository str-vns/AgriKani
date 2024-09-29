const { cloudinary } = require("../utils/cloudinary");
const { uploadImageMultiple, uploadImageSingle } = require("../utils/imageCloud");
const { STATUSCODE, ROLE } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const Product = require("../models/product");
const User = require("../models/user")
const ErrorHandler = require("../utils/errorHandler");
const user = require("../models/user");

exports.CreateProductReview = async (req) => {
  console.log(req.body.user)
  const userId = req.body.user
    // if (!mongoose.Types.ObjectId.isValid(req.body.user))
    //     throw new ErrorHandler(`Invalid Address ID: ${req.body.user}`);
    const product = await Product.findById(req.body.productId)
    const users = await User.findById(req.body.user)
    console.log(users)
    const isReview = product.reviews.find((prod) => prod.user?.toString() === userId?.toString());
    let image = product.reviews.image || []
    if(req.files || Array.isArray(req.files))
    {
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
        image = await uploadImageMultiple(req.files)
    }

    if(isReview) {
        product.reviews.forEach((review) => {
            if(review.user?.toString() === userId?.toString())
            {
                review.comment = req.body.comment
                review.rating =  req.body.rating
                review.image = image
            }
        }); 

    } else {
        product.reviews.push(
            {
                ...req.body,
                user: users._id,
                firstName: users.firstName,
                lastName: users.lastName,
                avatar: users.image,
                image: image
            }
        )
        product.numOfReviews = product.reviews.length
    }
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save({ validateBeforeSave: false})

    return product
}