const { upload } = require("../utils/cloudinary");
const CheckField = require("../helpers/FieldMonitor");
const asyncHandler = require("express-async-handler");
const farmProcess = require("../process/farmInfoProcess");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE } = require("../constants/index");

exports.CreateFarm = [
    upload.array("image"), 
    CheckField([
        "farmName",
        "region",
        "province",
        "city",
        "barangay",
        "address",
        "postalCode",
        "image",
        "latitude",
        "longitude",
      ]),
    asyncHandler(async (req, res) => {
      const farm = await farmProcess.CreateFarmProcess(req);
  
      return SuccessHandler(
        res,
        `Farm: ${farm?.farmName} has been created successfully`,
        farm
      );
    }),
  ];

exports.GetAllFarm = asyncHandler(async (req, res, next) => {
  const farm = await farmProcess.GetAllFarm();

  return farm?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Farm Found"))
    : SuccessHandler(res, `All Farm has been fetched Successfully`, farm);
});

exports.UpdateFarm = [
    upload.array("image"), 
    CheckField([
        "farmName",
        "region",
        "province",
        "city",
        "barangay",
        "address",
        "postalCode",
        "image",
      ]),
  asyncHandler(async (req, res) => {
    const farm = await farmProcess.UpdateFarmInfo(req, req.params.id);
    return SuccessHandler(
      res,
      `Farm ${farm?.farmName} has been Update Successfully`,
      farm
    );
  }),
];

exports.DeleteFarm = asyncHandler(async (req, res, next) => {
  const farm = await farmProcess.DeleteFarmInfo(req.params.id);

  return farm?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Farm Found"))
    : SuccessHandler(res, farm);
});

exports.SoftDelFarm = asyncHandler(async (req, res) => {
  const farm = await farmProcess.SoftDeleteFarmInfo(req.params.id);

  return SuccessHandler(
    res,
    `Farm ${farm.farmName} has been put in Archive Successfully`,
    farm
  );
});

exports.RestoreFarm = asyncHandler(async (req, res) => {
  const farm = await farmProcess.RestoreFarmInfo(req.params.id);

  return SuccessHandler(
    res,
    `The Farm ${farm.farmName} has been Restore Successfully`,
    farm
  );
});

exports.SingleFarm = asyncHandler(async (req, res) => {
  const farm = await farmProcess.singleFarm(req.params.id);

  return farm?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Farm Found"))
    : SuccessHandler(
        res,
        `${farm.farmName} has been fetched Successfully`,
        farm
      );
});
