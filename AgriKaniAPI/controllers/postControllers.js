const { upload } = require("../utils/cloudinary");
const CheckField = require("../helpers/FieldMonitor");
const asyncHandler = require("express-async-handler");
const postProcess = require("../process/postProcess");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE } = require("../constants/index");

exports.CreatePost = [
  upload.array("image"),
  asyncHandler(async (req, res) => {
    const post = await postProcess.CreatePostProcess(req);

    return SuccessHandler(
      res,
      `Post: ${post?._id} has been created successfully`,
      post
    );
  }),
];

exports.GetPost = asyncHandler(async (req, res, next) => {
  const post = await postProcess.GetAllPostInfo();

  return post?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Post Found"))
    : SuccessHandler(res, `All Post has been fetched Successfully`, post);
});

exports.UpdatePost = [
  upload.array("image"),
  asyncHandler(async (req, res) => {
    const post = await postProcess.UpdatePostInfo(req, req.params.id);
    return SuccessHandler(
      res,
      `Post with ID ${post?._id} has been updated successfully.`,
      post
    );
  }),
];

exports.DeletePost = asyncHandler(async (req, res, next) => {
  try {
    const post = await postProcess.DeletePostInfo(req.params.id);

    if (!post) {
      return next(new ErrorHandler("No Post Found", STATUSCODE.NOT_FOUND));
    }

    return SuccessHandler(res, post);
  } catch (error) {
    return next(error); // Ensure any unhandled errors are passed to the middleware
  }
});

exports.SoftDelPost = asyncHandler(async (req, res) => {
  const post = await postProcess.SoftDeletePostInfo(req.params.id);

  return SuccessHandler(
    res,
    `Post ${post._id} has been put in Archive Successfully`,
    post
  );
});

exports.RestorePost = asyncHandler(async (req, res) => {
  const post = await postProcess.RestorePostInfo(req.params.id);

  return SuccessHandler(
    res,
    `The Post ${post._id} has been Restore Successfully`,
    post
  );
});

exports.SinglePost = asyncHandler(async (req, res) => {
  const post = await postProcess.singlePost(req.params.id);

  return post?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Post Found"))
    : SuccessHandler(res, `${post._id} has been fetched Successfully`, post);
});

exports.UserPost = asyncHandler(async (req, res) => {
  const post = await postProcess.userPost(req.params.id);

  return post?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Post Found"))
    : SuccessHandler(res, `${post._id} has been fetched Successfully`, post);
});

exports.LikePost = asyncHandler(async (req, res) => {
  try {
    const post = await postProcess.likePost(req, req.params.id);

    return SuccessHandler(
      res,
      `Post ${post._id} has been updated successfully`,
      post
    );
  } catch (error) {
    return ErrorHandler(res, 500, error.message);
  }
});


// Approve Post
exports.UpdateStatusPost = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const post = await postProcess.UpdateStatusPost(req.params.id, status);
  return SuccessHandler(
    res,
    `Post ${post._id} has been ${status} successfully`,
    post
  );
});

exports.GetApprovedPosts = asyncHandler(async (req, res, next) => {
  const approvedPosts = await postProcess.GetApprovedPosts();

  return approvedPosts?.length === 0
    ? next(new ErrorHandler("No Approved Posts Found"))
    : SuccessHandler(res, `Approved Posts fetched successfully`, approvedPosts);
});

// Add a comment to a post
exports.AddComment = asyncHandler(async (req, res) => {
  const post = await postProcess.AddCommentToPost(req, req.params.postId);
  return SuccessHandler(res, "Comment added successfully", post);
});

// Get all comments for a post
exports.GetComments = asyncHandler(async (req, res) => {
  console.log("Fetching comments for post:", req.params.postId);

  const allPosts = await postProcess.GetAllPostInfo();
  const post = allPosts.find((p) => p._id.toString() === req.params.postId);

  if (!post) {
    return ErrorHandler(res, `Post not found with ID: ${req.params.postId}`, 404);
  }

  const comments = post.comments.map(({ sentimentScore, sentimentLabel, ...comment }) => comment);

  return SuccessHandler(res, "Comments fetched successfully", {
    comments,
    totalSentimentScore: post.totalSentimentScore,
    overallSentimentLabel: post.overallSentimentLabel,
  });
});

exports.DeletePostImage = asyncHandler(async (req, res) => {
  const product = await postProcess.deletePostImage(
    req.params.postId,
    req.params.imageId
  );

  return SuccessHandler(
    res,
    `Product Image has been deleted Successfully`,
    post
  );
});