const { upload } = require("../utils/cloudinary");
const CheckField = require("../helpers/FieldMonitor");
const asyncHandler = require("express-async-handler");
const typeProcess = require("../process/typeProcess");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE } = require("../constants/index");
const type = require("../models/type");

exports.createType = [
  CheckField(["typeName"]),
  asyncHandler(async (req, res) => {
    const type = await typeProcess.CreateType(req);

    return SuccessHandler(
      res,
      `Type: ${type?.typeName} has been created successfully`,
      type
    );
  }),
];

exports.GetAllType = asyncHandler(async (req, res, next) => {
  const type = await typeProcess.GetType()

  return type?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No type Found"))
    : SuccessHandler(
        res,
        `All Type has been fetched Successfully`,
        type
      );
});

exports.UpdateType = [
  CheckField(["typeName"]),
  asyncHandler(async (req, res) => {
    const type = await typeProcess.UpdateType(req, req.params.id);
    return SuccessHandler(
      res,
      `Type Name ${type?.typeName} has been Update Successfully`,
      type
    );
  }),
];

exports.DeleteType = asyncHandler(async (req, res, next) => {
  const type = await typeProcess.DeleteType(req.params.id);

  return type?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Type Found"))
    : SuccessHandler(res, type);
});

