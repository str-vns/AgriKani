const commentProcess = require("../process/commentProcess");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const { upload } = require("../utils/cloudinary");
const { STATUSCODE } = require("../constants/index");
const asyncHandler = require("express-async-handler");
const CheckField = require("../helpers/FieldMonitor");
exports.CreateProductReview = [
  upload.array("image"),
   CheckField(["rating", "comment", "user", "order", "productId"  ]),
  asyncHandler(async (req, res, next) => {
    const review = await commentProcess.CreateProductReview(req);

    return SuccessHandler(
      res,
      `Review: ${review?.firstName} ${review?.lastName} has been created successfully`,
      review
    );
  }),
];

exports.CreateCoopReview = [
  upload.array("image"),
   CheckField(["rating", "comment", "user", "order", "coopId"  ]),
  asyncHandler(async (req, res, next) => {
    const review = await commentProcess.CreateCoopReview(req);

    return SuccessHandler(
      res,
      `Review: ${review?.firstName} ${review?.lastName} has been created successfully`,
      review
    );
  }),
];

exports.CreateCourierReview = [
  upload.array("image"),
   CheckField(["rating", "comment", "user", "order", "driverId"  ]),
  asyncHandler(async (req, res, next) => {
    const review = await commentProcess.CreateCourierReview(req);

    return SuccessHandler(
      res,
      `Review: ${review?.firstName} ${review?.lastName} has been created successfully`,
      review
    );
  }),
];

exports.CreatePostComment = [
  CheckField(["comment", "user", "post"]), // Ensure field names match
  asyncHandler(async (req, res) => {
    const post = await commentProcess.CreatePostComment(req);
    return SuccessHandler(res, "Comment added successfully", post);
  }),
];

exports.CreateCoopReplyReview = [
  upload.array("image"),
  CheckField(["comment", "user"]),
  asyncHandler(async (req, res, next) => {
    const review = await commentProcess.CreateCoopReplyReview(req);

    return SuccessHandler(
      res,
      `Review: ${review?.firstName} ${review?.lastName} has been created successfully`,
      review
    );
  }),
];