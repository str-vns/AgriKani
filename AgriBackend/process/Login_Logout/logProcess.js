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
    accountUser.lastName
  );
  const accessTokenMaxAge = 7 * 24 * 60 * 60 * 1000;

  return { user: accountUser, accessToken, accessTokenMaxAge };
};

//Logout ...
exports.LogoutUser = async (cookies, res) => {
  return new Promise((resolve, reject) => {
    !cookies?.jwt
      ? reject(new ErrorHandler("No Token Found"))
      : (blacklistedTokens.push(cookies.jwt),
        res.clearCookie(RESOURCE.JWT, {
          httpOnly: true,
          secure: process.env.NODE_ENV === RESOURCE.PRODUCTION,
          sameSite: RESOURCE.NONE,
        }),
        resolve());
  });
};

//Blacklist Token ...
exports.getBlacklistedTokens = () => {
  return blacklistedTokens;
};
