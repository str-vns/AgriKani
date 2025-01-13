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
    },
    {
        method: METHOD.PATCH,
        path: PATH.DRIVER_IS_AVAILABLE,
        roles: [],
        handler: driverController.availableDriver,
    },
    {
        method: METHOD.POST,
        path: PATH.DRIVER_ASSING_LOCATION,
        roles: [],
        handler: driverController.postDriverLocation,
    },
    {
        method: METHOD.POST,
        path: PATH.DRIVER_MAX_CAPACITY,
        roles: [],
        handler: driverController.maxCapacityDriver,
    },
    {
        method: METHOD.PATCH,
        path: PATH.DRIVER_REMOVE_LOCATION,
        roles: [],
        handler: driverController.removeDriverLocation,
    },
    {
        method: METHOD.GET,
        path: PATH.DRIVER_SINGLE_ID,
        roles: [],
        handler: driverController.getSingleDriver,
    }
];


driverRoutes.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  router[method](path, authorizeRoles(...roles), handler);
});


module.exports = router;