const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLE } = require("../constants/index");

const userRoutes = [
  {
    method: METHOD.GET,
    path: PATH.USERS,
    roles: [ROLE.ADMIN],
    middleware: [verifyJWT],
    handler: userController.GetAllUsers,
  },
  {
    method: METHOD.POST,
    path: PATH.USERS,
    roles: [],
    middleware: [],
    handler: userController.SignUp,
  },
  {
    method: METHOD.PUT,
    path: PATH.USER_ID,
    roles: [ROLE.ADMIN, ROLE.CUSTOMER, ROLE.FARMER],
    middleware: [verifyJWT],
    handler: userController.UpdateUser,
  },
  {
    method: METHOD.DELETE,
    path: PATH.USER_ID,
    roles: [ROLE.ADMIN],
    middleware: [verifyJWT],
    handler: userController.DeleteUser,
  },
  {
    method: METHOD.PATCH,
    path: PATH.USER_ID,
    roles: [ROLE.ADMIN],
    middleware: [verifyJWT],
    handler: userController.SoftDelUser,
  },
  {
    method: METHOD.PATCH,
    path: PATH.RESTORE_ID,
    roles: [ROLE.ADMIN],
    middleware: [verifyJWT],
    handler: userController.RestoreUser,
  },
  {
    method: METHOD.GET,
    path: PATH.USER_ID,
    roles: [ROLE.ADMIN, ROLE.CUSTOMER, ROLE.FARMER],
    middleware: [verifyJWT],
    handler: userController.UserProfile,
  },
];

userRoutes.forEach((route) => {
  const { method, path, roles = [], middleware = [], handler } = route;
  router[method](path, 
    middleware.concat(authorizeRoles(...roles)), 
    handler);
});

module.exports = router;
