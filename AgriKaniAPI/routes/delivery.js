const express = require("express");
const router = express.Router();
const deliveryControllers = require("../controllers/deliveryControllers");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLE } = require("../constants/index");

const deliveryRoutes = [
    {
        method: METHOD.POST,
        path: PATH.DELIVERY,
        roles: [],
        handler: deliveryControllers.createDelivery,
    },
    {
        method: METHOD.GET,
        path: PATH.DELIVERY_TRACK_ID,
        roles: [],
        handler: deliveryControllers.getDeliveryTracking,
    },
    {
        method: METHOD.GET,
        path: PATH.DELIVERY_DRIVER_ID,
        roles: [],
        handler: deliveryControllers.getDeliveryDriver,
    },
    {
        method: METHOD.PATCH,
        path: PATH.DELIVERY_ID,
        roles: [],
        handler: deliveryControllers.UpdateDeliveryStatus,
    },
    {
        method: METHOD.PATCH,
        path: PATH.DELIVERY_QR_CODE,
        roles: [],
        handler: deliveryControllers.qrCodeDelivered,
    },
];

deliveryRoutes.forEach((route) => {
    const { method, path, roles = [], handler } = route;
    router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;
