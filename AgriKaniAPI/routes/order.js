const express = require("express");
const { createOrder, getOrderById, getUserOrders, updateOrderStatus } = require("../controllers/orderController");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");

const router = express.Router();

// Authenticated users can create an order
router.post("/order", verifyJWT, createOrder);

// Authenticated users and admins can get a single order by ID
// router.get("/order/:id", verifyJWT, authorizeRoles("admin", "user"), getOrderById);
router.get("/order/user/:id", verifyJWT, authorizeRoles("admin", "user"), getOrderById);
// router.get("/order/:id", verifyJWT, authorizeRoles("admin", "user"), getOrderById);

// Authenticated users and admins can get all orders for a user
router.get("/orders", verifyJWT, authorizeRoles("admin", "user"), getUserOrders);

// Only admin can update the order status
router.patch("/order/:id", verifyJWT, authorizeRoles("admin"), updateOrderStatus);

module.exports = router;    