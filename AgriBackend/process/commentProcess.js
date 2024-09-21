const { cloudinary } = require("../utils/cloudinary");
const { uploadImageMultiple, uploadImageSingle } = require("../utils/imageCloud");
const { STATUSCODE, ROLE } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");

exports.CreateProductReview = async (req) => {
    // if (!mongoose.Types.ObjectId.isValid(req.body.user))
    //     throw new ErrorHandler(`Invalid Address ID: ${req.body.user}`);
   
    const product = await Product.findById(req.body.productId)
    const isReview = product.reviews.find((prod) => prod.user)
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

    let images = {}
    if (req.file) {
        images = await uploadImageSingle(req.file)
      }

    if(isReview) {
        product.reviews.forEach((review) => {
            if(review.user.toString() === req.user.id.toString())
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
                avatar: images,
                image: image
            }
        )
        product.numOfReviews = product.reviews.length
    }
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save({ validateBeforeSave: false})
}