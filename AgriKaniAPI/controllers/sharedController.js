const asyncHandler = require("express-async-handler");
const sharedpostProcess = require("../process/sharedPostProcess");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE } = require("../constants/index");

exports.CreateSharedPost = [
  asyncHandler(async (req, res) => {
    const spost = await sharedpostProcess.CreateSharedPostProcess(req);
    return SuccessHandler(
      res,
      `Shared Post: ${spost?._id} has been created successfully`,
      spost
    );
  }),
];

exports.GetSharedPost = asyncHandler(async (req, res, next) => {
  const spost = await sharedpostProcess.GetAllSharedPostInfo();

  return spost?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Shared Post Found"))
    : SuccessHandler(res, `All Shared Post has been fetched Successfully`, spost);
});

exports.UpdateSharedPost = [
  asyncHandler(async (req, res) => {
    const spost = await sharedpostProcess.UpdateSharedPostInfo(req, req.params.id);
    return SuccessHandler(
      res,
      `Share Post ${spost?._id} has been Update Successfully`,
      spost
    );
  }),
];

exports.DeleteSharedPost = asyncHandler(async (req, res, next) => {
  const spost = await sharedpostProcess.DeleteSharedPostInfo(req.params.id);

  return spost?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Shared Post Found"))
    : SuccessHandler(res, spost);
});

exports.SoftDelSharedPost = asyncHandler(async (req, res) => {
  const spost = await sharedpostProcess.SoftDeleteSharedPostInfo(req.params.id);

  return SuccessHandler(
    res,
    `Shared Post ${spost._id} has been put in Archive Successfully`,
    spost
  );
});

exports.RestoreSharedPost = asyncHandler(async (req, res) => {
  const spost = await sharedpostProcess.RestoreSharedPostInfo(req.params.id);

  return SuccessHandler(
    res,
    `The Shared Post ${spost._id} has been Restore Successfully`,
    spost
  );
});

exports.SingleSharedPost = asyncHandler(async (req, res) => {
  const spost = await sharedpostProcess.singleSharedPost(req.params.id);

  return spost?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Post Found"))
    : SuccessHandler(res, `${spost._id} has been fetched Successfully`, spost);
});

exports.UserSharedPost = asyncHandler(async (req, res) => {
  const spost = await sharedpostProcess.userSharedPost(req.params.id);

  return spost?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Shared Post Found"))
    : SuccessHandler(res, `${spost._id} has been fetched Successfully`, spost);
});
