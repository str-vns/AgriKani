const { upload } = require("../utils/Cloudinary");
const CheckField = require("../helpers/FieldMonitor");
const asyncHandler = require("express-async-handler");
const userProcess = require("../process/userProcess");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler")
const { STATUSCODE } = require("../constants/index")

exports.SignUp = [
  upload.array("image"),
  CheckField(["firstName", "lastName", "age","phoneNum", "email", "password", "image"]),
  asyncHandler(async (req, res) => {
    console.log("Received file:", req.files)
    const user = await userProcess.registerUser(req);
    return SuccessHandler(
      res,
      `User Name ${user?.firstName} ${" "} ${
        user?.lastName
      } has been created Successfully`,
      user
    );
  }),
];

exports.GetAllUsers = asyncHandler(async (req, res, next)=>{
  const users = await userProcess.GetAllUserInfo();

  return users?.length === STATUSCODE.ZERO
  ? next(new ErrorHandler("No User Found"))
  : SuccessHandler(res, `All Users has been fetched Successfully`, users)
})

exports.UpdateUser = [
  upload.array("image"),
  CheckField(["firstName", "lastName","phoneNum","gender","image"]),
  asyncHandler(async (req, res) => {
    console.log("Received file:", req.files)
    const user = await userProcess.UpdateUserInfo(req, res, req.params.id);
    return SuccessHandler(
      res,
      `User Name ${user?.firstName} ${" "} ${
        user?.lastName
      } has been created Successfully`,
      user
    );
  }),
];
