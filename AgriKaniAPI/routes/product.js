const express = require("express");
const router = express.Router();
const productController = require("../controllers/productControllers");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLE } = require("../constants/index");

router.get("/products/ranked", productController.getRankedProducts);

const productRoutes = [
  {
    method: METHOD.POST,
    path: PATH.PRODUCTS,
    roles: [],
    handler: productController.productCreate,
  },
  {
    method: METHOD.GET,
    path: PATH.PRODUCTS,
    roles: [],
    handler: productController.GetAllProduct,
  },
  {
    method: METHOD.PUT,
    path: PATH.PRODUCTS_EDIT_ID,
    roles: [],
    handler: productController.UpdateProduct,
  },
  {
    method: METHOD.DELETE,
    path: PATH.PRODUCTS_ID,
    roles: [ROLE.COOPERATIVE],
    handler: productController.DeleteProduct,
  },
  {
    method: METHOD.PATCH,
    path: PATH.PRODUCTS_SOFTDEL_ID,
    roles: [],
    handler: productController.SoftDelProduct,
  },
  {
    method: METHOD.PATCH,
    path: PATH.RESTORE_PRODUCT_ID,
    roles: [],
    handler: productController.RestoreProduct,
  },
  {
    method: METHOD.GET,
    path: PATH.PRODUCTS_ID,
    roles: [],
    handler: productController.SingleProduct,
  },
  {
    method: METHOD.GET,
    path: PATH.COOP_ONLY_PRODUCTS_ID,
    roles: [],
    handler: productController.CoopOnlyProducts
  },
  {
    method: METHOD.GET,
    path: PATH.PRODUCT_ARCHIVE_ID,
    roles: [ROLE.CUSTOMER, ROLE.COOPERATIVE],
    handler: productController.CoopOnlyArcProducts,
  },
  {
    method: METHOD.PUT,
    path: PATH.IMAGE_PRODUCT_DELETE,
    roles: [],
    handler: productController.DeleteProductImage,
  },
];

productRoutes.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;
