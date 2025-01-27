const { upload } = require("../utils/cloudinary");
const CheckField = require("../helpers/FieldMonitor");
const asyncHandler = require("express-async-handler");
const farmProcess = require("../process/farmInfoProcess");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE } = require("../constants/index");

exports.CreateFarm = [
  upload.fields([
    { name: "image", maxCount: 10 },
    { name: "businessPermit", maxCount: 1 },
    { name: "corCDA", maxCount: 1 },
    { name: "orgStructure", maxCount: 1 },
  ]),
  CheckField([
    "farmName",
    "city",
    "barangay",
    "address",
    "postalCode",
    "latitude",
    "longitude",
    "user",
    "tinNumber",
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

exports.GetNoApproveCoops = asyncHandler(async (req, res, next) => {
  const farm = await farmProcess.GetAllInactiveCoop();

  return farm?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Farm Found"))
    : SuccessHandler(res, `All Inactive Cooperative has been fetched Successfully`, farm);
})

exports.GetCoopAllFetch = asyncHandler(async (req, res, next) => {
  const coop = await farmProcess.GetAllofCoop();

  return coop?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Farm Found"))
    : SuccessHandler(res, `All Cooperative has been fetched Successfully`, coop);
})

exports.UpdateFarm = [
  upload.array("image"),
  CheckField(["farmName", "image"]),
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

exports.DeleteFarmImage = asyncHandler(async (req, res) => {
  const farm = await farmProcess.FarmDeleteImage(
    req.params.id,
    req.params.imageId
  );

  return SuccessHandler(res, `Farm Image has been deleted Successfully`, farm);
});

exports.GetCoopOrders = asyncHandler(async (req, res) => {
  const coop = await farmProcess.CoopOrders(req.params.id);

  return coop?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Farm Found"))
    : SuccessHandler(
        res,
        `All Cooperative Orders has been fetched Successfully`,
        coop
      );
});

exports.GetSingleCoop = asyncHandler(async (req, res) => {
  const coop = await farmProcess.coopSingle(req.params.id);

  return coop?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Farm Found"))
    : SuccessHandler(res, `Cooperative has been fetched Successfully`, coop);
});

exports.ApproveCooperative = asyncHandler(async (req, res) => {
  const coop = await farmProcess.ApproveCoop(req.params.id, req);

  return SuccessHandler(
    res,
    `Cooperative has been Approved Successfully`,
    coop
  );
});

exports.DisapproveCooperative = asyncHandler(async (req, res) => {
  const coop = await farmProcess.DisapproveCoop(req.params.id);

  return SuccessHandler(
    res,
    `Cooperative has been Disapproved Successfully`,
    coop
  );
});

exports.getSingleFarmInfo = asyncHandler(async (req, res) => {
  const farm = await farmProcess.singleFarmInfo(req.params.id);

  return farm?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Farm Found"))
    : SuccessHandler(
        res,
        `All Farm Information has been fetched Successfully`,
        farm
      );
});