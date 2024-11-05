const express = require("express");
const router = express.Router();
const categorieController = require("../controllers/categoryControllers");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLE } = require("../constants/index");

const categoryRoutes = [
  {
    method: METHOD.POST,
    path: PATH.CATEGORY,
    roles: [],
    handler: categorieController.categorieCreate,
  },
  {
    method: METHOD.GET,
    path: PATH.CATEGORY,
    roles: [],
    handler: categorieController.GetAllCategories,
  },
  {
    method: METHOD.PUT,
    path: PATH.CATEGORY_ID,
    roles: [],
    handler: categorieController.UpdateCategories,
  },
  {
    method: METHOD.DELETE,
    path: PATH.CATEGORY_ID,
    roles: [],
    handler: categorieController.DeleteCategories,
  },
];

categoryRoutes.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;
