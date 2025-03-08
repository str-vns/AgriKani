const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentControllers");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLES } = require("../constants/index");

const commentRoutes = [
  {
    method: METHOD.POST,
    path: PATH.COMMENT,
    roles: [],
    handler: commentController.CreateProductReview,
  },
  {
    method: METHOD.POST,
    path: PATH.COMMENT_COOP,
    roles: [],
    handler: commentController.CreateCoopReview,
  },
  {
    method: METHOD.POST,
    path: PATH.COMMENT_COURIER,
    roles: [],
    handler: commentController.CreateCourierReview,
  },
  {
    method: METHOD.POST,
    path: PATH.POST_ADD_COMMENT,
    roles: [],
    handler: commentController.CreatePostComment,
  },
];



commentRoutes.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;
