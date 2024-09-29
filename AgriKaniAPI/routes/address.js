const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressControllers");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLES } = require("../constants/index");

const addressRoutes = [
  {
    method: METHOD.POST,
    path: PATH.ADDRESS,
    roles: [],
    handler: addressController.AddressCreate,
  },
  {
    method: METHOD.GET,
    path: PATH.ADDRESS,
    roles: [],
    handler: addressController.AddressRead,
  },
  {
    method: METHOD.PUT,
    path: PATH.ADDRESS_ID,
    roles: [],
    handler: addressController.AddressUpdate,
  },
  {
    method: METHOD.DELETE,
    path: PATH.ADDRESS_ID,
    roles: [],
    handler: addressController.AddressDelete,
  },
  {
    method: METHOD.GET,
    path: PATH.ADDRESS_ID,
    roles: [],
    handler: addressController.SingleAddress,
  },
];

addressRoutes.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;
