const Post = require("../models/post");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const { cloudinary } = require("../utils/cloudinary");
const { uploadImageMultiple } = require("../utils/imageCloud");
const { analyzeMixedLanguage } = require("../utils/mixLanguage");
// NOTE Three DOTS MEANS OK IN COMMENT

//create ...
exports.CreatePostProcess = async (req) => {
  console.log("Received File:", req.files);

  let image = [];
  if (req.files && Array.isArray(req.files)) {
    image = await uploadImageMultiple(req.files);
  }

  const post = await Post.create({
    ...req.body,
    image: image,
  });

  return post;
};

//Read ...
// exports.GetAllPostInfo = async () => {
//   const post = await Post.find()
//     .sort({ createdAt: STATUSCODE.NEGATIVE_ONE })
//     .populate({
//       path: 'author',
//       select: 'firstName lastName', // Only fetch these fields from the user schema
//     })
//     .lean()
//     .exec();

//   return post;
// };

//Update ...
exports.UpdatePostInfo = async (req, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Post ID: ${id}`);

  const postExist = await Post.findById(id).lean().exec();
  if (!postExist) throw new ErrorHandler(`Post does not exist with ID: ${id}`);

  if (postExist.deletedAt) {
    throw new ErrorHandler(`Post with ID ${id} has been deleted.`);
  }

  if (Array.isArray(postExist.image)) {
    postExist.image.forEach((img, index) => {
      console.log(`Image ${index + 1} public_id:`, img?.public_id);
    });
  }

  let image = postExist.image || [];

  if (req.files && req.files.length > 0) {
    await Promise.all(
      image.map(async (img, index) => {
        try {
          const result = await cloudinary.uploader.destroy(img.public_id);
          console.log(`Image ${index + 1} deleted:`, result);
        } catch (error) {
          console.error(`Failed to delete Image ${index + 1}:`, error);
        }
      })
    );
    image = await uploadImageMultiple(req.files);
  }

  const updatedData = { ...req.body };
  if (req.files && req.files.length > 0) {
    updatedData.image = image;
  }

  const updatePost = await Post.findByIdAndUpdate(
    id,
    updatedData,
    {
      new: true,
      runValidators: true,
    }
  ).lean();

  if (!updatePost) throw new ErrorHandler(`Post not updated with ID ${id}`);
  
  return updatePost;
};

//Delete ...
exports.DeletePostInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Post ID: ${id}`);

  const postExist = await Post.findOne({ _id: id });
  if (!postExist) throw new ErrorHandler(`Post not exist with ID: ${id}`);

  const publicIds = postExist.image.public_id;

  await Promise.all([
    Post.deleteOne({ _id: id }).lean().exec(),
    cloudinary.uploader.destroy(publicIds),
  ]);

  return postExist;
};

//SoftDelete ...
exports.SoftDeletePostInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Post ID: ${id}`);

  const postExist = await Post.findOne({ _id: id });
  if (!postExist) throw new ErrorHandler(`Post not exist with ID: ${id}`);

  const softDelPost = await Post.findByIdAndUpdate(
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
  if (!softDelPost) throw new ErrorHandler(`Post not SoftDelete with ID ${id}`);
  return softDelPost;
};

//Restore ...
exports.RestorePostInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Post ID: ${id}`);

  const postExist = await Post.findOne({ _id: id });
  if (!postExist) throw new ErrorHandler(`Post not exist with ID: ${id}`);

  const restorePost = await Post.findByIdAndUpdate(
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
  if (!restorePost)
    throw new ErrorHandler(`Post was not retrive with ID ${id}`);
  return restorePost;
};

//Single Post ...
exports.singlePost = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Post ID: ${id}`);

  const singlePost = await Post.findById(id).lean().exec();

  if (!singlePost) throw new ErrorHandler(`Post not exist with ID: ${id}`);

  return singlePost;
};

exports.userPost = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Post ID: ${id}`);

  const userPost = await Post.find({ author: id })
    .populate({
      path: "likes.user",
      select: "firstName lastName image",
    })
    .populate({
      path: "comments.user", // Populate user inside comments
      select: "firstName lastName image",
    })
    .lean() // Optimize performance
    .exec();

  if (!userPost.length) throw new ErrorHandler(`User not exist with ID: ${id}`);

  console.log(JSON.stringify(userPost, null, 2));

  return userPost;
};


//likePost 
exports.likePost = async (req, id) => {
  try {
    const userId = req.body.user;
    console.log("User ID:", userId);

    const post = await Post.findById(id);
    if (!post) {
      throw new Error("Post not found");
    }

    console.log("Post found:", post);

    // Ensure likes array exists
    if (!post.likes) {
      post.likes = [];
    }

    const isLikedIndex = post.likes.findIndex(
      (like) => like.user?.toString() === userId?.toString()
    );

    console.log("Like index:", isLikedIndex);

    if (isLikedIndex === -1) {
      post.likes.push({ user: userId });
      post.likeCount += 1;
      console.log("Post Liked");
    } else {
      post.likes.splice(isLikedIndex, 1);
      post.likeCount -= 1;
      console.log("Post Unliked");
    }

    await post.save();

    return post;
  } catch (error) {
    console.error("Error in likePost:", error.message);
    throw error; // Rethrow for controller to handle
  }
};


// Approve Post
exports.UpdateStatusPost = async (id, status) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Post ID: ${id}`);

  const postExist = await Post.findById(id).lean().exec();
  if (!postExist) throw new ErrorHandler(`Post not exist with ID: ${id}`);

  if (!['approved'].includes(status)) {
    throw new ErrorHandler('Status must be either "approved"');
  }

  const updatePost = await Post.findByIdAndUpdate(
    id,
    { status: status },
    { new: true }
  );

  return updatePost;
};

// Filter approved posts
exports.GetApprovedPosts = async () => {
  const approvedPosts = await Post.find({ status: "approved" })
    .sort({ createdAt: -1 })  // Ensure sorting works properly
    .populate({
      path: "author",
      select: "firstName lastName image",
    })
    .populate({
      path: "comments.user",
      select: "firstName lastName",
    })
    .lean()
    .exec();

  return approvedPosts;
};

exports.AddCommentToPost = async (req, postId) => {
  const { userId, comment } = req.body;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ErrorHandler(`Invalid Post ID: ${postId}`);
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ErrorHandler(`Post not found with ID: ${postId}`);
  }

  // Perform Sentiment Analysis on the Comment
  const sentimentResult = analyzeMixedLanguage(comment);

  const newComment = {
    user: userId,
    comment: comment,
    sentimentScore: sentimentResult.sentimentScore,
    sentimentLabel: sentimentResult.sentimentLabel,
    createdAt: new Date(),
  };

  post.comments.push(newComment);

    // **Recalculate Total Sentiment Score & Label**
    post.totalSentimentScore = post.comments.reduce((sum, c) => sum + c.sentimentScore, 0) / post.comments.length;

    // **Determine Overall Sentiment Label**
    if (post.totalSentimentScore > 0) {
      post.overallSentimentLabel = "positive";
    } else if (post.totalSentimentScore < 0) {
      post.overallSentimentLabel = "negative";
    } else {
      post.overallSentimentLabel = "neutral";
    }
  
  await post.save();

  return post;
};

exports.GetAllPostInfo = async () => {
  const post = await Post.find()
    .sort({ createdAt: STATUSCODE.NEGATIVE_ONE })
    .populate({
      path: "author",
      select: "firstName lastName",
    })
    .lean()
    .exec();

  // Compute total sentiment score & overall sentiment for each post
  post.forEach((p) => {
    // Calculate total sentiment score
    const totalSentimentScore = (p.comments || []).reduce(
      (sum, comment) => sum + (comment.sentimentScore || 0),
      0
    );
    // Determine overall sentiment based on total score
    let overallSentimentLabel = "neutral";
    if (totalSentimentScore > 0) {
      overallSentimentLabel = "positive";
    } else if (totalSentimentScore < 0) {
      overallSentimentLabel = "negative";
    }
    // Attach sentiment summary at post level
    p.totalSentimentScore = totalSentimentScore;
    p.overallSentimentLabel = overallSentimentLabel;
  });

  return post;
};

exports.deletePostImage = async (postId, imageId) => {
  console.log("Post ID:", postId);
  console.log("Image ID:", imageId);

  if (!mongoose.Types.ObjectId.isValid(postId))
    throw new ErrorHandler(`Invalid Post ID: ${postId}`);

  const singlePost = await Post.findById(postId).lean().exec();
  if (!singlePost) throw new ErrorHandler(`Post does not exist with ID: ${postId}`);

  const imageToDelete = singlePost.image.find(img => img._id.toString() === imageId);
  if (!imageToDelete) {
    throw new ErrorHandler(`Image with ID: ${imageId} does not exist in the post.`);
  }

  await cloudinary.uploader.destroy(imageToDelete.public_id);

  await Post.updateOne(
    { _id: postId },
    { $pull: { image: { _id: imageId } } }
  );

  console.log('Post image deleted successfully');
  return { message: 'Post image deleted successfully' };
};
