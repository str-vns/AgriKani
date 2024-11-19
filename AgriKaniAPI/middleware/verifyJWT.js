const { verifyAccessToken } = require("../utils/token");
const ErrorHandler = require("../utils/errorHandler");
const { getBlacklistedTokens } = require("../process/userProcess");
const { STATUSCODE } = require("../constants/index");

exports.verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.match(/^Bearer\s+(.*)$/)) {
      throw new ErrorHandler("Please Log In First", STATUSCODE.UNAUTHORIZED);
    }

    const token = authHeader.split(" ")[1];

    if (getBlacklistedTokens().includes(token)) {
      throw new ErrorHandler("Token Already Expired", STATUSCODE.FORBIDDEN);
    }

    // Verify token and extract user info
    const decoded = verifyAccessToken(token);
    req.user = decoded?.CustomerInfo?.email; 
    req.roles = decoded?.CustomerInfo?.roles;

    next();
  } catch (error) {
    next(error);
  }
};

exports.authorizeRoles =
  (...allowedRoles) =>
  (req, res, next) => {
    if (allowedRoles.length === 0 || !req.roles) {
      return next();
    }
    if (req.roles.some((role) => allowedRoles.includes(role))) {
      return next();
    }
    return next(
      new ErrorHandler(
        `Roles ${req.roles.join(", ")} are not allowed to access this resource`,
        STATUSCODE.FORBIDDEN
      )
    );
  };