const { upload } = require("../utils/cloudinary");
const CheckField = require("../helpers/FieldMonitor");
const asyncHandler = require("express-async-handler");
const userProcess = require("../process/userProcess");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE } = require("../constants/index");

exports.SignUp = [
  upload.single("image"),
  CheckField(["firstName", "lastName", "age", "phoneNum", "email", "password", "otp"]),
  asyncHandler(async (req, res) => {
    const user = await userProcess.registerUser(req);

    return SuccessHandler(
      res,
      `User Name ${user?.firstName} ${user?.lastName} has been created Successfully`,
      user
    );
  }),
];

exports.GetAllUsers = asyncHandler(async (req, res, next) => {
  const users = await userProcess.GetAllUserInfo();

  return users?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No User Found"))
    : SuccessHandler(res, `All Users has been fetched Successfully`, users);
});

exports.UpdateUser = [
  upload.single("image"),
  CheckField(["firstName", "lastName", "phoneNum"]),
  asyncHandler(async (req, res) => {
    const user = await userProcess.UpdateUserInfo(req, req.params.id);
    return SuccessHandler(
      res,
      `User Name ${user?.firstName} ${user?.lastName} has been Update Successfully`,
      user
    );
  }),
];

exports.DeleteUser = asyncHandler(async (req, res, next) => {
  const user = await userProcess.DeleteUserInfo(req.params.id);

  return user?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No User Found"))
    : SuccessHandler(res, user);
});

exports.SoftDelUser = asyncHandler(async (req, res) => {
  const user = await userProcess.SoftDeleteUserInfo(req.params.id);

  return SuccessHandler(
    res,
    `User Name ${user?.firstName} ${user?.lastName} has been put in Archive Successfully`,
    user
  );
});

exports.RestoreUser = asyncHandler(async (req, res) => {
  const user = await userProcess.RestoreUserInfo(req.params.id);

  return SuccessHandler(
    res,
    `User Name ${user?.firstName} ${user?.lastName} has been Restore Successfully`,
    user
  );
});

exports.UserProfile = asyncHandler(async (req, res) => {
  const user = await userProcess.ProfileUserInfo(req.params.id);

  return user?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No User Found"))
    : SuccessHandler(
        res,
        `${user?.firstName} ${user?.lastName} has been fetched Successfully`,
        user
      );
});
