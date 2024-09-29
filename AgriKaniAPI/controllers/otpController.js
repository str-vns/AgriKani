const asyncHandler = require("express-async-handler");
const SuccessHandler = require("../utils/successHandler");
const OtpProcess = require("../process/otpProcess");

exports.CreateOtp = [
    asyncHandler(async (req, res) => {
      const otp = await OtpProcess.sendOTP(req, res);
  
      return SuccessHandler(
        res,
        `OTP has been created successfully`,
        otp
      );
    }),
  ];



