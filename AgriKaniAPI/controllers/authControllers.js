const FieldMonitor = require("../helpers/FieldMonitor");
const asyncHandler = require("express-async-handler");
const logProcess = require("../process/Login_Logout/logProcess");
const token = require("../utils/token");
const SuccessHandler = require("../utils/successHandler");

//login
exports.login = [
  FieldMonitor(["email", "password"]),
  asyncHandler(async (req, res) => {
    const { user, accessToken, accessTokenMaxAge } = await logProcess.LoginUser(
      req.body.email,
      req.body.password
    );

    const setCookie = token.setAccessTokenCookie(accessTokenMaxAge);
    setCookie(res, accessToken);
    SuccessHandler(
      res,
      `User ${user?.firstName} ${user?.lastName} successfully login`,
      {
        user,
        accessToken,
      }
    );
  }),
];

exports.logout = asyncHandler(async (req, res) => {
  console.log(req.cookies);
  const cookies = await logProcess.LogoutUser(req.cookies, res);
           
  return SuccessHandler(res, "User Successfully Logout", cookies);
});

exports.DeviceToken = [
  FieldMonitor(["deviceToken"]),
  asyncHandler(async (req, res) => {
    const user = await logProcess.saveDeviceToken(req);

    return SuccessHandler(res, "Device Token has been saved", user);
  }),
]