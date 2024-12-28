const express = require("express");
const router = express.Router();
const typeController = require("../controllers/typeControllers");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLE } = require("../constants/index");

// Type Routes
router.post("/type", verifyJWT, typeController.createType); // Create type
router.get("/type", typeController.GetAllType); // Get all types
router.get("/type/:id", typeController.GetTypeById); // Get single type by ID
router.put("/type/:id", verifyJWT, typeController.UpdateType); // Update type by ID
router.delete("/type/:id", verifyJWT, typeController.DeleteType); // Delete type by ID


const typeRoutes = [
  {
    method: METHOD.POST,
    path: PATH.TYPE,
    roles: [],
    handler: typeController.createType,
  },
  {
    method: METHOD.GET,
    path: PATH.TYPE,
    roles: [],
    handler: typeController.GetAllType,
  },
  {
    method: METHOD.PUT,
    path: PATH.TYPE_ID,
    roles: [],
    handler: typeController.UpdateType,
  },
  {
    method: METHOD.DELETE,
    path: PATH.TYPE_ID,
    roles: [],
    handler: typeController.DeleteType,
  },
];

typeRoutes.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;
