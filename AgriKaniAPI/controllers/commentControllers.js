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
