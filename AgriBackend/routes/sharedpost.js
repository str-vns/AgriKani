const express = require("express");
const router = express.Router();
const sharedController = require("../controllers/sharedController");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLES } = require("../constants/index");

const shareRoutes = [
  {
    method: METHOD.POST,
    path: PATH.SHARE_POST,
    roles: [],
    handler:sharedController.CreateSharedPost,
  },
  {
    method: METHOD.GET,
    path: PATH.SHARE_POST,
    roles: [],
    handler: sharedController.GetSharedPost,
  },
  {
    method: METHOD.PUT,
    path: PATH.SHARE_POST_ID,
    roles: [],
    handler: sharedController.UpdateSharedPost,
  },
  {
    method: METHOD.DELETE,
    path: PATH.SHARE_POST_ID,
    roles: [],
    handler: sharedController.DeleteSharedPost,
  },
  {
    method: METHOD.PATCH,
    path: PATH.SHARE_POST_ID,
    roles: [],
    handler: sharedController.SoftDelSharedPost,
  },
  {
    method: METHOD.PATCH,
    path: PATH.RESTORE_SHARE_POST_ID,
    roles: [],
    handler: sharedController.RestoreSharedPost,
  },
  {
    method: METHOD.GET,
    path: PATH.SHARE_POST_ID,
    roles: [],
    handler: sharedController.UserSharedPost,
  },
];

shareRoutes.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;
