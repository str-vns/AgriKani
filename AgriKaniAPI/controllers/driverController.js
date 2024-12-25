const DriverProcess = require("../process/driverProcess");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const { upload } = require("../utils/cloudinary");
const { STATUSCODE } = require("../constants/index");
const asyncHandler = require("express-async-handler");
const CheckField = require("../helpers/FieldMonitor");

exports.registerDriver = [
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "driversLicenseImage", maxCount: 1 },
  ]),
  CheckField(["email", "password", "phoneNum", "age", "otp"]),
  asyncHandler(async (req, res) => {
    const driver = await DriverProcess.registerDriverProcess(req);
    return SuccessHandler(
      res,
      `Driver: ${driver?.email} has been created successfully`,
      driver
    );
  }),
];

exports.getDrivers = asyncHandler(async (req, res, next) => {
  const drivers = await DriverProcess.getDriverProcess();
  return drivers?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Driver Found"))
    : SuccessHandler(res, `All Drivers has been fetched Successfully`, drivers);
});

exports.getDriverDisapprove = asyncHandler(async (req, res, next) => {
  const drivers = await DriverProcess.getDriverDisapproveProcess();
  return drivers?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Driver Found"))
    : SuccessHandler(
        res,
        `All Disapprove Drivers has been fetched Successfully`,
        drivers
      );
});

exports.getDriverId = asyncHandler(async (req, res, next) => {
  const driver = await DriverProcess.getDriverByIdProcess(req.params.id);
  return driver
    ? SuccessHandler(res, `Driver has been fetched Successfully`, driver)
    : next(new ErrorHandler("No Driver Found"));
});

exports.approveDriver = asyncHandler(async (req, res, next) => {
  const driver = await DriverProcess.approveDriverProcess(req.params.id);
  return driver
    ? SuccessHandler(res, `Driver has been approved Successfully`, driver)
    : next(new ErrorHandler("No Driver Found"));
});

exports.disapproveDriver = asyncHandler(async (req, res, next) => {
  const driver = await DriverProcess.disapproveDriverProcess(req.params.id);
  return driver
    ? SuccessHandler(res, `Driver has been disapproved Successfully`, driver)
    : next(new ErrorHandler("No Driver Found"));
});

exports.deleteDriver = asyncHandler(async (req, res, next) => {
  const driver = await DriverProcess.deleteDriverProcess(req.params.id);
  return driver
    ? SuccessHandler(res, `Driver has been deleted Successfully`, driver)
    : next(new ErrorHandler("No Driver Found"));
});

exports.getCoopDriver = asyncHandler(async (req, res, next) => {
  const drivers = await DriverProcess.getCoopDriverProcess(req.params.id);
  return drivers?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Driver Found"))
    : SuccessHandler(res, `All Cooperative Drivers has been fetched Successfully`, drivers);
});