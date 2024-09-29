const express = require("express");
const router = express.Router();
const logLimiter = require("../middleware/loginLimiter");
const authController = require("../controllers/authControllers");
const { METHOD, PATH } = require("../constants/index");

const authRoutes = [
  {
    method: METHOD.POST,
    path: PATH.LOGIN,
    middleware: [logLimiter],
    handler: authController.login,
  },
  {
    method: METHOD.POST,
    path: PATH.LOGOUT,
    middleware: [],
    handler: authController.logout,
  },
];

authRoutes.forEach((route) => {
  const { method, path, middleware, handler } = route;
  router[method](path, ...middleware, handler);
});

module.exports = router;
