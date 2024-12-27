const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driverController");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLE } = require("../constants/index");
const { path } = require("pdfkit");

const driverRoutes = [
    {
        method: METHOD.POST,
        path: PATH.DRIVER,
        roles: [], 
        handler: driverController.registerDriver,
    },
    {
        method: METHOD.GET,
        path: PATH.DRIVER,
        roles: [], 
        handler: driverController.getDrivers,
    },
    {
        method: METHOD.GET,
        path: PATH.DRIVER_DISAPPROVED,
        roles: [], 
        handler: driverController.getDriverDisapprove,
    },
    {
        method: METHOD.GET,
        path: PATH.DRIVER_ID,
        roles: [], 
        handler: driverController.getDriverId,
    },
    {
        method: METHOD.PATCH,
        path: PATH.DRIVER_APPROVED_ID,
        roles: [], 
        handler: driverController.approveDriver,
    },
    {
        method: METHOD.PATCH,
        path: PATH.DRIVER_DISAPPROVED_ID,
        roles: [],
        handler: driverController.disapproveDriver,
    },
    {
        method: METHOD.DELETE,
        path: PATH.DRIVER_ID,
        roles: [],
        handler: driverController.deleteDriver,
    },
    {
        method: METHOD.GET,
        path: PATH.DRIVER_COOP_ID,
        roles: [],
        handler: driverController.getCoopDriver,
    },
    {
        method: METHOD.GET,
        path: PATH.DRIVER_COOP_ONLY_APPROVED_ID,
        roles: [],
        handler: driverController.getDriverByIdApprove,
    }
];


driverRoutes.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  router[method](path, authorizeRoles(...roles), handler);
});


module.exports = router;