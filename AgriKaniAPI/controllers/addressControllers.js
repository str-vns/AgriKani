const CheckField = require("../helpers/FieldMonitor");
const asyncHandler = require("express-async-handler");
const addressProcess = require("../process/addressProcess");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE } = require("../constants/index");

exports.AddressCreate = [
  CheckField([
    "city",
    "barangay",
    "address",
    "postalCode",
    "latitude",
    "longitude",
  ]),
  asyncHandler(async (req, res) => {
    const address = await addressProcess.CreateAddressProcess(req);

    return SuccessHandler(
      res,
      `Address has been created successfully`,
      address
    );
  }),
];

exports.AddressRead = asyncHandler(async (req, res, next) => {
  const address = await addressProcess.GetAllAddressInfo();

  return address?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Address Found"))
    : SuccessHandler(res, `All Address has been fetched Successfully`, address);
});

exports.AddressUpdate = [
  CheckField([
    "city",
    "barangay",
    "address",
    "postalCode",
    "latitude",
    "longitude",
  ]),
  asyncHandler(async (req, res) => {
    const address = await addressProcess.UpdateAddressInfo(req, req.params.id);
    return SuccessHandler(res, `Address has been Update Successfully`, address);
  }),
];

exports.AddressDelete = asyncHandler(async (req, res, next) => {
  const address = await addressProcess.DeleteAddressInfo(req.params.id);

  return address?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Address Found"))
    : SuccessHandler(res, address);
});

exports.SingleAddress = asyncHandler(async (req, res, next) => {
  const address = await addressProcess.singleAddress(req.params.id);

  return address?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Address Found"))
    : SuccessHandler(
        res,
        `${address.fullName} Address has been fetched Successfully`,
        address
      );
});
