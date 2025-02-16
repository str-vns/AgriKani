const express = require("express");
const router = express.Router();
const cancelledController = require("../controllers/cancelledControllers");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLE } = require("../constants/index");


const cancelledRoutes = [
  {
    method: METHOD.POST,
    path: PATH.CANCELLED,
    roles: [],
    handler: cancelledController.CreateCancelled,
  },
  {
    method: METHOD.GET,
    path: PATH.CANCELLED,
    roles: [],
    handler: cancelledController.GetAllCancelled,
  },
  {
    method: METHOD.GET,
    path: PATH.CANCELLED_ID,
    roles: [],
    handler: cancelledController.GetSingleCancelled,
  }
];

cancelledRoutes.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;
