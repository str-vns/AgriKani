const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryControllers");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLE } = require("../constants/index");


const inventoryRoutes = [
  {
    method: METHOD.POST,
    path: PATH.INVENTORY,
    roles: [],
    handler: inventoryController.CreateInventory,
  },
  {
    method: METHOD.GET,
    path: PATH.INVENTORY,
    roles: [],
    handler: inventoryController.GetAllInventory,
  },
  {
    method: METHOD.GET,
    path: PATH.INVENTORY_ID,
    roles: [],
    handler: inventoryController.GetSingleInventory,
  },
  {
    method: METHOD.PUT,
    path: PATH.INVENTORY_UPDATE_ID,
    roles: [],
    handler: inventoryController.UpdateInventory,
  },
  {
    method: METHOD.DELETE,
    path: PATH.INVENTORY_ID,
    roles: [],
    handler: inventoryController.DeleteInventory,
  },
  {
    method: METHOD.PATCH,
    path: PATH.INVENTORY_ACTIVE_ID,
    roles: [],
    handler: inventoryController.ActiveInventory,
  },
  {
    method: METHOD.PATCH,
    path: PATH.INVENTORY_INACTIVE_ID,
    roles: [],
    handler: inventoryController.InActiveInventory,
  },
  {
    method: METHOD.GET,
    path: PATH.INVENTORY_PRODUCT_ID,
    roles: [],
    handler: inventoryController.getInventoryProduct,
  },
  {
    method: METHOD.POST,
    path: PATH.INVENTORY_STOCK_CHECK,
    roles: [],
    handler: inventoryController.inventoryCheck,
  },
  {
    method: METHOD.POST,
    path: PATH.INVENTORY_DASHBOARD,
    roles: [],
    handler: inventoryController.inventoryDashboard,
  },
];

inventoryRoutes.forEach((route) => {
    const { method, path, roles = [], handler } = route;
    router[method](path, authorizeRoles(...roles), handler);
  });
  

module.exports = router;
