const CheckField = require("../../helpers/FieldMonitor");
const asyncHandler = require("express-async-handler");
const pwdProcess = require("../../process/Discount/pwdProcess");
const SuccessHandler = require("../../utils/successHandler");
const ErrorHandler = require("../../utils/errorHandler");
const { STATUSCODE } = require("../../constants/index");
const { upload } = require("../../utils/cloudinary");

exports.PwdCreate = [
    upload.fields([
        { name: "frontImage", maxCount: 1 },
        { name: "backImage", maxCount: 1 },
      ]),
    CheckField([
      "firstName",
      "lastName",
      "type_of_Disability",
    ]),
    asyncHandler(async (req, res) => {
      const pwd = await pwdProcess.CreatePwdProcess(req);
  
      return SuccessHandler(
        res,
        `Pwd Application has been created successfully`,
        pwd
      );
    }),
  ];

exports.GetAllPwd = asyncHandler(async (req, res) => {
    const pwd = await pwdProcess.GetAllPwdInfoProcess(req);
  
    return SuccessHandler(res, "Pwd Application fetched successfully", pwd);
  }
);

exports.GetPwdById = asyncHandler(async (req, res) => {
    const pwd = await pwdProcess.GetPwdByIdProcess(req.params.id);
  
    return SuccessHandler(res, "Pwd Application fetched successfully", pwd);
  }
);
    
exports.ApprovedPwd = asyncHandler(async (req, res) => {
    const pwd = await pwdProcess.ApprovedPwdProcess(req.params.id);
  
    return SuccessHandler(res, "Pwd Application Approved successfully", pwd);
  });  

exports.DisapprovedPwd = asyncHandler(async (req, res) => {
    const pwd = await pwdProcess.DisapprovedPwdProcess(req.params.id);
  
    return SuccessHandler(res, "Pwd Application Disapproved successfully", pwd);
  });

exports.GetApprovedPwd = asyncHandler(async (req, res) => {
    const pwd = await pwdProcess.GetApprovedPwdProcess();
  
    return SuccessHandler(res, "Approved Pwd Application fetched successfully", pwd);
    }
);