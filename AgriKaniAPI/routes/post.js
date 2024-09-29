const express = require("express");
const router = express.Router();
const postControllers = require("../controllers/postControllers");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLES } = require("../constants/index");

const postRoutes = [
  {
    method: METHOD.POST,
    path: PATH.POST,
    roles: [],
    handler: postControllers.CreatePost,
  },
  {
    method: METHOD.GET,
    path: PATH.POST,
    roles: [],
    handler: postControllers.GetPost,
  },
  {
    method: METHOD.PUT,
    path: PATH.POST_ID,
    roles: [],
    handler: postControllers.UpdatePost,
  },
  {
    method: METHOD.DELETE,
    path: PATH.POST_ID,
    roles: [],
    handler: postControllers.DeletePost,
  },
  {
    method: METHOD.PATCH,
    path: PATH.POST_ID,
    roles: [],
    handler: postControllers.SoftDelPost,
  },
  {
    method: METHOD.PATCH,
    path: PATH.RESTORE_POST_ID,
    roles: [],
    handler: postControllers.RestorePost,
  },
  {
    method: METHOD.GET,
    path: PATH.POST_ID,
    roles: [],
    handler: postControllers.SinglePost,
  },
  {
    method: METHOD.GET,
    path: PATH.POST_USER_ID,
    roles: [],
    handler: postControllers.UserPost,
  },
  {
    method: METHOD.POST,
    path: PATH.POST_ID,
    roles: [],
    handler: postControllers.LikePost,
  },
];

postRoutes.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;
