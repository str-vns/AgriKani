const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLES } = require("../constants/index");


// // Authenticated users can create an order
// router.post("/order", verifyJWT, createOrder);

// // Authenticated users and admins can get a single order by ID
// // router.get("/order/:id", verifyJWT, authorizeRoles("admin", "user"), getOrderById);
// router.get("/order/user/:id", verifyJWT, authorizeRoles("admin", "user"), getOrderById);
// // router.get("/order/:id", verifyJWT, authorizeRoles("admin", "user"), getOrderById);

// // Authenticated users and admins can get all orders for a user
// router.get("/orders", verifyJWT, authorizeRoles("admin", "user"), getUserOrders);

// // Only admin can update the order status
// router.patch("/order/:id", verifyJWT, authorizeRoles("admin"), updateOrderStatus);

const orderRoutes = [
    // {
    //   method: METHOD.POST,
    //   path: PATH.POST,
    //   roles: [],
    //   handler: postControllers.CreatePost,
    // },
    {
      method: METHOD.GET,
      path: PATH.ORDER_USER_ID,
      roles: [],
      handler: orderController.GetOrderUser,
    },
    // {
    //   method: METHOD.PUT,
    //   path: PATH.POST_ID,
    //   roles: [],
    //   handler: postControllers.UpdatePost,
    // },
    // {
    //   method: METHOD.DELETE,
    //   path: PATH.POST_ID,
    //   roles: [],
    //   handler: postControllers.DeletePost,
    // },
    // {
    //   method: METHOD.PATCH,
    //   path: PATH.POST_ID,
    //   roles: [],
    //   handler: postControllers.SoftDelPost,
    // },
    // {
    //   method: METHOD.PATCH,
    //   path: PATH.RESTORE_POST_ID,
    //   roles: [],
    //   handler: postControllers.RestorePost,
    // },
    // {
    //   method: METHOD.GET,
    //   path: PATH.POST_ID,
    //   roles: [],
    //   handler: postControllers.SinglePost,
    // },
    // {
    //   method: METHOD.GET,
    //   path: PATH.POST_USER_ID,
    //   roles: [],
    //   handler: postControllers.UserPost,
    // },
    // {
    //   method: METHOD.POST,
    //   path: PATH.POST_ID,
    //   roles: [],
    //   handler: postControllers.LikePost,
    // },
  ];
  
  orderRoutes.forEach((route) => {
    const { method, path, roles = [], handler } = route;
    router[method](path, authorizeRoles(...roles), handler);
  });

module.exports = router; 