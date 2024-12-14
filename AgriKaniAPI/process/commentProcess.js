const { cloudinary } = require("../utils/cloudinary");
const { uploadImageMultiple, uploadImageSingle } = require("../utils/imageCloud");
const { STATUSCODE, ROLE } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const Product = require("../models/product");
const User = require("../models/user")
const ErrorHandler = require("../utils/errorHandler");
const user = require("../models/user");
const { analyzeMixedLanguage } = require("../utils/mixLanguage");

exports.CreateProductReview = async (req) => {
  console.log(req.body.user)
  const userId = req.body.user
  const orderId = req.body.order
    // if (!mongoose.Types.ObjectId.isValid(req.body.user))
    //     throw new ErrorHandler(`Invalid Address ID: ${req.body.user}`);
    const product = await Product.findById(req.body.productId)
    const users = await User.findById(req.body.user)
    
    const isReview = product.reviews.find(
      (prod) => prod.user?.toString() === userId?.toString() && prod.order?.toString() === orderId?.toString()
    );
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
    var result = analyzeMixedLanguage(req.body.comment)
    console.log(result)
    if(isReview) {
        product.reviews.forEach((review) => {
            if(review.user?.toString() === userId?.toString())
            {
                review.comment = req.body.comment
                review.rating =  req.body.rating
                review.image = image
                review.sentimentScore = result.sentimentScore
            }
        }); 
        
    } else {
        product.reviews.push(
            {
                ...req.body,
                user: users._id,
                image: image,
                sentimentScore: result.sentimentScore
            }
        )
        product.numOfReviews = product.reviews.length
    }

    const totalSentimentScore = product.reviews.reduce((sum, review) => sum + review.sentimentScore, 0);
    const overallScore = totalSentimentScore / product.reviews.length;
    product.sentimentOverall = overallScore;

    if (overallScore >= 15) {
      product.sentiment = 'Mostly positive';
      console.log("Mostly positive");
  } else if (overallScore > 0) {
      product.sentiment = 'positive';
      console.log("positive");
  } else if (overallScore <= -15) {
      product.sentiment = 'Mostly negative';
      console.log("Mostly negative");
  } else if (overallScore < 0) {
      product.sentiment = 'negative';
      console.log("negative");
  } else {
      product.sentiment = 'neutral';
      console.log("neutral");
  }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save({ validateBeforeSave: false})

    return product
}

