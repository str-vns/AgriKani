const { cloudinary } = require("../utils/cloudinary");
const { uploadImageMultiple, uploadImageSingle } = require("../utils/imageCloud");
const { STATUSCODE, ROLE } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const Product = require("../models/product");
const Farm = require("../models/farm");
const Driver = require("../models/driver");
const User = require("../models/user")
const Post = require("../models/post");
const ErrorHandler = require("../utils/errorHandler");
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
                review.driverRating = req.body.driverRating
                review.serviceRating = req.body.serviceRating
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

exports.CreateCoopReview = async (req) => {
  console.log(req.body.user)
  const userId = req.body.user
    // if (!mongoose.Types.ObjectId.isValid(req.body.user))
    //     throw new ErrorHandler(`Invalid Address ID: ${req.body.user}`);
    const farm = await Farm.findById(req.body.coopId)

    const users = await User.findById(req.body.user)
    
    const isReview = farm.reviews.find(
      (prod) => prod.user?.toString() === userId?.toString() && prod.order?.toString() === orderId?.toString()
    );
    let image = farm.reviews.image || []
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
      farm.reviews.forEach((review) => {
            if(review.user?.toString() === userId?.toString())
            {
                review.comment = req.body.comment
                review.rating =  req.body.rating
                review.image = image
                review.sentimentScore = result.sentimentScore
            }
        }); 
        
    } else {
      farm.reviews.push(
            {
                ...req.body,
                user: users._id,
                image: image,
                sentimentScore: result.sentimentScore
            }
        )
        farm.numOfReviews = farm.reviews.length
    }

    const totalSentimentScore = farm.reviews.reduce((sum, review) => sum + review.sentimentScore, 0);
    const overallScore = totalSentimentScore / farm.reviews.length;
    farm.sentimentOverall = overallScore;

    if (overallScore >= 15) {
      farm.sentiment = 'Mostly positive';
      console.log("Mostly positive");
  } else if (overallScore > 0) {
    farm.sentiment = 'positive';
      console.log("positive");
  } else if (overallScore <= -15) {
    farm.sentiment = 'Mostly negative';
      console.log("Mostly negative");
  } else if (overallScore < 0) {
    farm.sentiment = 'negative';
      console.log("negative");
  } else {
    farm.sentiment = 'neutral';
      console.log("neutral");
  }

  farm.ratings = farm.reviews.reduce((acc, item) => item.rating + acc, 0) / farm.reviews.length;
    await farm.save({ validateBeforeSave: false})

    return farm
}


exports.CreateCourierReview = async (req) => {
  const userId = req.body.user
    // if (!mongoose.Types.ObjectId.isValid(req.body.user))
    //     throw new ErrorHandler(`Invalid Address ID: ${req.body.user}`);
    const driver = await Driver.findById(req.body.driverId)

    const users = await User.findById(req.body.user)
    
    const isReview = driver.reviews.find(
      (prod) => prod.user?.toString() === userId?.toString() && prod.order?.toString() === orderId?.toString()
    );
    let image = driver.reviews.image || []
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
      driver.reviews.forEach((review) => {
            if(review.user?.toString() === userId?.toString())
            {
                review.comment = req.body.comment
                review.rating =  req.body.rating
                review.image = image
                review.sentimentScore = result.sentimentScore
            }
        }); 
        
    } else {
      driver.reviews.push(
            {
                ...req.body,
                user: users._id,
                image: image,
                sentimentScore: result.sentimentScore
            }
        )
        driver.numOfReviews = driver.reviews.length
    }

    const totalSentimentScore = driver.reviews.reduce((sum, review) => sum + review.sentimentScore, 0);
    const overallScore = totalSentimentScore / driver.reviews.length;
    driver.sentimentOverall = overallScore;

    if (overallScore >= 15) {
      driver.sentiment = 'Mostly positive';
      console.log("Mostly positive");
  } else if (overallScore > 0) {
    driver.sentiment = 'positive';
      console.log("positive");
  } else if (overallScore <= -15) {
    driver.sentiment = 'Mostly negative';
      console.log("Mostly negative");
  } else if (overallScore < 0) {
    driver.sentiment = 'negative';
      console.log("negative");
  } else {
    driver.sentiment = 'neutral';
      console.log("neutral");
  }

  driver.ratings = driver.reviews.reduce((acc, item) => item.rating + acc, 0) / driver.reviews.length;
    await driver.save({ validateBeforeSave: false})

    return driver
}

exports.CreatePostComment = async (req) => {
  console.log(req.body.user);
  const userId = req.body.user;
  const postId = req.body.post;

  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error(`Invalid User ID: ${userId}`);
  }

  // Validate postId
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new Error(`Invalid Post ID: ${postId}`);
  }

  // Ensure post exists
  const post = await Post.findById(postId)
  if (!post) {
    throw new Error(`Post not found with ID: ${postId}`);
  }

  // Ensure user exists
  const users = await User.findById(userId);
  if (!users) {
    throw new Error(`User not found with ID: ${userId}`);
  }

  // Validate comment
  if (!req.body.comment || typeof req.body.comment !== "string") {
    throw new Error("Comment text is required and must be a string.");
  }

  var result = analyzeMixedLanguage(req.body.comment);
  console.log(result);

   post.comments.push({
    comment: req.body.comment,
    user: users._id,
    sentimentScore: result.sentimentScore,
    sentimentLabel: result.sentimentLabel,
  });

  // Update the number of comments
  post.numOfComments = post.comments.length;

  // Sentiment analysis calculation
  const totalSentimentScore = post.comments.reduce((sum, comment) => sum + comment.sentimentScore, 0);
  const overallScore = totalSentimentScore / post.comments.length;
  post.totalSentimentScore = overallScore;

  if (overallScore >= 15) {
    post.overallSentimentLabel = "Mostly positive";
    console.log("Mostly positive");
  } else if (overallScore > 0) {
    post.overallSentimentLabel = "positive";
    console.log("positive");
  } else if (overallScore <= -15) {
    post.overallSentimentLabel = "Mostly negative";
    console.log("Mostly negative");
  } else if (overallScore < 0) {
    post.overallSentimentLabel = "negative";
    console.log("negative");
  } else {
    post.overallSentimentLabel = "neutral";
    console.log("neutral");
  }

  await post.save({ validateBeforeSave: false });

  return post;
};