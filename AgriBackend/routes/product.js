const express = require("express");
const router = express.Router();
const productController = require("../controllers/productControllers");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLES } = require("../constants/index");

const productRoutes = [
  {
    method: METHOD.POST,
    path: PATH.PRODUCTS,
    roles: [],
    handler: productController.productCreate,
  },
];

productRoutes.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;
