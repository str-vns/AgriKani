const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLES } = require("../constants/index");

const orderRoutes = [
  {
    method: METHOD.POST,
    path: PATH.ORDER,
    roles: [],
    handler: orderController.createOrder,
  },
  {
    method: METHOD.GET,
    path: PATH.ORDER_USER_ID,
    roles: [],
    handler: orderController.GetOrderUser,
  },
  {
    method: METHOD.PUT,
    path: `${PATH.ORDER}/:orderId/status`,
    roles: [],
    handler: orderController.updateOrderStatus,
  },
  {
    method: METHOD.DELETE,
    path: `${PATH.ORDER}/:orderId`,
    roles: [],
    handler: orderController.deleteOrder,
  },
];

orderRoutes.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  router[method](path, verifyJWT, authorizeRoles(...roles), handler);
});

module.exports = router;