const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLES } = require("../constants/index");

router.get('/order/daily', orderController.getDailySalesReport);
router.get('/order/weekly', orderController.getWeeklySalesReport);
router.get('/order/monthly', orderController.getMonthlySalesReport);
router.get("/coopdashboard/:id", orderController.getCoopDashboardData);
router.get("/overalldashboard", orderController.getOverallDashboardData);


const orderRoutes = [
  {
    method: METHOD.POST,
    path: PATH.ORDER,
    roles: [],
    handler: orderController.createOrder,
  },
  {
    method: METHOD.GET,
    path: PATH.ORDER_USER_ID,
    roles: [],
    handler: orderController.GetOrderUser,
  },
  {
    method: METHOD.PUT,
    path: PATH.ORDER_STATUS_EDIT,
    roles: [],
    handler: orderController.updateOrderStatus,
  },
  {
    method: METHOD.DELETE,
    path: PATH.ORDER_DELETE,
    roles: [],
    handler: orderController.deleteOrder,
  },
  {
    method: METHOD.PATCH,
    path: PATH.COOP_ID_UPDATE_ORDERS,
    roles: [],
    handler: orderController.updateOrderStatusCoop,
  },
  {
    method: METHOD.GET,
    path: PATH.COOP_USER_ORDERS_ID,
    roles: [],
    handler: orderController.GetOrderCoop,
  },
  {
    method: METHOD.GET,
    path: PATH.COOP_SHIPPING,
    roles: [],
    handler: orderController.getShippedOrders,
  },
  {
    method: METHOD.POST,
    path: PATH.ONLINE_PAYMENT,
    roles: [],
    handler: orderController.onlinePayment,
  },
  {
    method: METHOD.GET,
    path: PATH.ONLINE_PAYMENT_ID,
    roles: [],
    handler: orderController.paymentStatus,
  },
]; 

orderRoutes.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;