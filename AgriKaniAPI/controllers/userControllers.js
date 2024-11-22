const { upload } = require("../utils/cloudinary");
const CheckField = require("../helpers/FieldMonitor");
const asyncHandler = require("express-async-handler");
const userProcess = require("../process/userProcess");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE } = require("../constants/index");

exports.SignUp = [
  upload.single("image"),
  CheckField([
    "firstName",
    "lastName",
    "age",
    "phoneNum",
    "email",
    "password",
    "otp",
  ]),
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

exports.SingleUser = asyncHandler(async (req, res) => {
  const user = await userProcess.ProfileUserInfo(req.params.id);

  return user?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No User Found"))
    : SuccessHandler(
        res,
        `${user?.firstName} ${user?.lastName} has been fetched Successfully`,
        user
      );
});

exports.WishlistUser = asyncHandler(async (req, res) => {
  const wish = await userProcess.wishlistProduct(
    req.params.productId,
    req.params.id
  );
  console.log(wish, "Wishlist User");
  return SuccessHandler(
    res,
    `User ${wish?.firstName} ${wish?.lastName} wishlist has been add Successfully`,
    wish
  );
});

exports.UsersWish = asyncHandler(async (req, res) => {
  const wish = await userProcess.wishlistProductGet(req.params.id);
  console.log(wish, "Wishlist User");
  return SuccessHandler(
    res,
    `User ${wish?.firstName} ${wish?.lastName} wishlist has been add Successfully`,
    wish
  );
});

exports.GetUserCount = asyncHandler(async (req, res) => {
  const userCount = await userProcess.GetTotalUserCount();
  
  return userCount === STATUSCODE.ZERO
    ? res.status(200).json({ message: "No users found", count: 0 })
    : SuccessHandler(res, `Total users fetched successfully`, { count: userCount });
});

exports.getUserTypeCount = asyncHandler(async (req, res, next) => {
  try {
    const userTypeCount = await userProcess.getUserTypeCount();

    if (userTypeCount.length === 0) {
      return next(new ErrorHandler("No users found", STATUSCODE.NOT_FOUND));
    }

    return SuccessHandler(res, "User type countss1s fetched successfully", userTypeCount);
  } catch (error) {
    return next(new ErrorHandler(error.message, STATUSCODE.INTERNAL_SERVER_ERROR));
  }
});
