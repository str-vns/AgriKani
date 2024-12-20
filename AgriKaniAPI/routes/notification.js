const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationControllers");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLE } = require("../constants/index");

const notificationRoutes = [
{
    method: METHOD.POST,
    path: PATH.NOTIFICATION,
    roles: [],
    handler: notificationController.createNotification,
}, 
{
    method: METHOD.GET,
    path: PATH.NOTIFICATION,
    roles: [],
    handler: notificationController.getAllNotification,
},               
{
    method: METHOD.GET,
    path: PATH.NOTIFICATION_ID,
    roles: [],
    handler: notificationController.getSingleNotification,
},
{
    method: METHOD.PATCH,
    path: PATH.NOTIFICATION_READ,
    roles: [],
    handler: notificationController.readNotification,
},
{
    method: METHOD.PATCH,
    path: PATH.NOTIFICATION_READ_ALL,
    roles: [],
    handler: notificationController.readAllNotification,
}
]

notificationRoutes.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;