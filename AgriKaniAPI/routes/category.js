const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categoryControllers");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLE } = require("../constants/index");

// // Category Routes
// router.post("/category", verifyJWT, categoriesController.categorieCreate);
// router.get("/category", categoriesController.GetAllCategories);
// router.get("/category/:id", categoriesController.GetSingleCategory);
// router.put("/category/:id", verifyJWT, categoriesController.UpdateCategories);
// router.delete("/category/:id", categoriesController.DeleteCategories);

const categoryRoutes = [
  {
    method: METHOD.POST,
    path: PATH.CATEGORY,
    roles: [],
    handler: categoriesController.categorieCreate,
  },
  {
    method: METHOD.GET,
    path: PATH.CATEGORY,
    roles: [],
    handler: categoriesController.GetAllCategories,
  },
  {
    method: METHOD.PUT,
    path: PATH.CATEGORY_ID,
    roles: [],
    handler: categoriesController.UpdateCategories,
  },
  {
    method: METHOD.DELETE,
    path: PATH.CATEGORY_ID,
    roles: [],
    handler: categoriesController.DeleteCategories,
  },
];

categoryRoutes.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;
