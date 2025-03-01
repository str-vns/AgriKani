const CheckField = require("../../helpers/FieldMonitor");
const asyncHandler = require("express-async-handler");
const seniorProcess = require("../../process/Discount/seniorProcess");
const SuccessHandler = require("../../utils/successHandler");
const ErrorHandler = require("../../utils/errorHandler");
const { STATUSCODE } = require("../../constants/index");
const { upload } = require("../../utils/cloudinary");

exports.SeniorCreate = [
    upload.fields([
        { name: "frontImage", maxCount: 1 },
        { name: "backImage", maxCount: 1 },
      ]),
    CheckField([
      "firstName",
      "lastName",
      "birthDate",
    ]),
    asyncHandler(async (req, res) => {
      const pwd = await seniorProcess.CreateSeniorProcess(req);
  
      return SuccessHandler(
        res,
        `Pwd Application has been created successfully`,
        pwd
      );
    }),
  ];

exports.GetAllSenior = asyncHandler(async (req, res) => {
    const pwd = await seniorProcess.GetAllSeniorInfoProcess(req);
  
    return SuccessHandler(res, "Pwd Application fetched successfully", pwd);
  }
);

exports.GetSeniorById = asyncHandler(async (req, res) => {
    const pwd = await seniorProcess.SingleSeniorInfoProcess(req.params.id);
  
    return SuccessHandler(res, "Pwd Application fetched successfully", pwd);
  }
);
  
exports.GetApprovedSenior = asyncHandler(async (req, res) => {
    const pwd = await seniorProcess.GetApprovedSeniorProcess(req);
  
    return SuccessHandler(res, "Pwd Application fetched successfully", pwd);
  }
);

exports.ApprovedSenior = asyncHandler(async (req, res) => {
    const pwd = await seniorProcess.ApprovedSeniorProcess(req.params.id);
  
    return SuccessHandler(res, "Pwd Application Approved successfully", pwd);
  });  

exports.DisapprovedSenior = asyncHandler(async (req, res) => {
    const pwd = await seniorProcess.DisapprovedSeniorInfoProcess(req.params.id);
  
    return SuccessHandler(res, "Pwd Application Disapproved successfully", pwd);
  });

  