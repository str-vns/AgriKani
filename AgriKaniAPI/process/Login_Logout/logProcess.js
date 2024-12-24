const bcrypt = require("bcrypt");
const token = require("../../utils/token");
const User = require("../../models/user");
const ErrorHandler = require("../../utils/errorHandler");
const { RESOURCE } = require("../../constants/index")

const blacklistedTokens = [];
// NOTE Three DOTS MEANS OK IN COMMENT

//Login ...
exports.LoginUser = async (email, password) => {
  const accountUser = await User.findOne({ email }).select("+password").exec();
  console.log(accountUser);
  if (!accountUser)
    throw new ErrorHandler(`Either Email or Password is Incorrect`);

  const matchPassword = await bcrypt.compare(password, accountUser.password);

  if (!matchPassword) throw new ErrorHandler(`Wrong Password`);

  const accessToken = token.generateAccessToken(
    accountUser.email,
    accountUser.roles,
    accountUser.firstName,
    accountUser.lastName,
    accountUser.image
  );
  const accessTokenMaxAge = 7 * 24 * 60 * 60 * 1000;

  return { user: accountUser, accessToken, accessTokenMaxAge };
};

//Logout ...
exports.LogoutUser = (cookies, res) => {
  return new Promise((resolve, reject) => {
    !cookies?.jwt
      ? reject(new Error("You are not logged in"))
      : (blacklistedTokens.push(cookies.jwt),
        res.clearCookie(RESOURCE.JWT, {
          httpOnly: true,
          secure: process.env.NODE_ENV === RESOURCE.PRODUCTION,
          sameSite: RESOURCE.NONE,
        }),
        resolve());
        console.log("User Successfully Logout");
  });
};

//Blacklist Token ...
exports.getBlacklistedTokens = () => {
  return blacklistedTokens;
};

//Save Device Token ...
exports.saveDeviceToken = async (req) => {
  const user = await User.findOne({ email: req.body.email, }).exec();
  const deviceToken = req.body.deviceToken;
  if (!deviceToken) throw new ErrorHandler("Device Token is required");

  if (!user.deviceToken.includes(deviceToken)){
    user.deviceToken.push(deviceToken);
    await user.save();
    console.log("Device Token Saved");
  } else {
    console.log("Device Token Already Exists");
    return "Device Token Already Exists";
  }
}