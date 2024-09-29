const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otpController");
const { METHOD, PATH, ROLE } = require("../constants/index");

const otpRoutes = [
  {
    method: METHOD.POST,
    path: PATH.OTP,
    handler: otpController.CreateOtp,
  },
];

otpRoutes.forEach((route) => {
  const { method, path, roles = [], middleware = [], handler } = route;
  router[method](path, handler);
});

module.exports = router;
