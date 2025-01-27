const express = require("express");
const router = express.Router();
const farmController = require("../controllers/farmControllers");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLES } = require("../constants/index");

const farmRoutes = [
  {
    method: METHOD.POST,
    path: PATH.FARM,
    roles: [],
    handler: farmController.CreateFarm,
  },
  {
    method: METHOD.GET,
    path: PATH.FARM,
    roles: [],
    handler: farmController.GetAllFarm,
  },
  {
    method: METHOD.PUT,
    path: PATH.FARM_ID,
    roles: [],
    handler: farmController.UpdateFarm,
  },
  {
    method: METHOD.DELETE,
    path: PATH.FARM_ID,
    roles: [],
    handler: farmController.DeleteFarm,
  },
  {
    method: METHOD.PATCH,
    path: PATH.FARM_ID,
    roles: [],
    handler: farmController.SoftDelFarm,
  },
  {
    method: METHOD.PATCH,
    path: PATH.RESTORE_FARM_ID,
    roles: [],
    handler: farmController.RestoreFarm,
  },
  {
    method: METHOD.GET,
    path: PATH.FARM_ID,
    roles: [],
    handler: farmController.SingleFarm,
  },
  {
    method: METHOD.PUT,
    path: PATH.IMAGE_FARM_DELETE,
    roles: [],
    handler: farmController.DeleteFarmImage,
  },
  {
    method: METHOD.GET,
    path: PATH.COOP_ID_ORDERS,
    roles: [],
    handler: farmController.GetCoopOrders,
  },
  {
    method: METHOD.GET,
    path: PATH.COOP_ID,
    roles: [],
    handler: farmController.GetSingleCoop,
  },
  {
    method: METHOD.GET,
    path: PATH.COOP,
    roles: [],
    handler: farmController.GetCoopAllFetch,
  },
  {
    method: METHOD.GET,
    path: PATH.COOP_INACTIVE,
    roles: [],
    handler: farmController.GetNoApproveCoops,
  },
  {
    method: METHOD.PATCH,
    path: PATH.COOP_ACTIVE,
    roles: [],
    handler: farmController.ApproveCooperative,
  },
  {
    method: METHOD.DELETE,
    path: PATH.COOP_DISAPPROVE,
    roles: [],
    handler: farmController.DisapproveCooperative,
  },
  {
    method: METHOD.GET,
    path: PATH.FARM_ID_INFO,
    roles: [],
    handler: farmController.getSingleFarmInfo,
  },
];

farmRoutes.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;
