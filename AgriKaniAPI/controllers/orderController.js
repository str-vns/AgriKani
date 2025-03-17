const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/errorHandler");
const SuccessHandler = require("../utils/successHandler");
const orderProcess = require("../process/orderProcess");
const { STATUSCODE } = require("../constants/index");

// Create a new order
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice, shippingPrice, user, payStatus } = req.body;
  console.log("orderItems", req.body);
  try {
    const createdOrder = await orderProcess.createOrderProcess({
      user,
      orderItems,
      shippingAddress,
      paymentMethod,
      payStatus,
      shippingPrice,
      totalPrice,
    });

    // Populate the order with user, product, and address details
    // const populatedOrder = await Order.findById(createdOrder._id)
    //   .populate({ path: "user", select: "firstName lastName email" })
    //   .populate({ path: "orderItems.product", select: "productName pricing" })
    //   .populate({ path: "shippingAddress", select: "fullName phoneNum address city postalCode" })
    //   .lean();

    // if (!populatedOrder) {
    //   return next(new ErrorHandler("Order not found after creation", 404));
    // }
    return SuccessHandler(res, "Order created and receipt sent successfully", createdOrder);
  } catch (error) {
    return next(new ErrorHandler(error.message, STATUSCODE.SERVER_ERROR));
  }
});

// Update order status
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  try {
    const updatedOrder = await orderProcess.updateOrderStatusProcess(req.params.id, req);
    return SuccessHandler(res, "Order status updated successfully", updatedOrder);
  } catch (error) {
    return next(new ErrorHandler(error.message, error.statusCode || 500));
  }
});

// Delete an order
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  try {
    await orderProcess.deleteOrderProcess(orderId);
    return SuccessHandler(res, "Order deleted successfully");
  } catch (error) {
    return next(new ErrorHandler(error.message, error.statusCode || 500));
  }
});

// Get order by user ID
exports.GetOrderUser = asyncHandler(async (req, res, next) => {
  const Orders = await orderProcess.getOrderById(req.params.id);
  
  return Orders?.length === STATUSCODE.ZERO
      ? next(new ErrorHandler("No User Order Found", STATUSCODE.NOT_FOUND))
      : SuccessHandler(res, "All orders fetched successfully", Orders);
  
});

exports.updateOrderStatusCoop = asyncHandler(async (req, res, next) => {
  try {
    const updatedOrder = await orderProcess.updateOrderStatusCoop(req.params.id, req);
    return SuccessHandler(res, "Order status updated successfully", updatedOrder);
  } catch (error) {
    return next(new ErrorHandler(error.message, error.statusCode || 500));
  }
});

exports.getShippedOrders = asyncHandler(async (req, res, next) => {
  try {
    const shippedOrders = await orderProcess.getShippedOrdersProcess(req.params.id);
    return SuccessHandler(res, "Shipped orders fetched successfully", shippedOrders);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.getReceipt = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const receiptPath = path.join(__dirname, `../receipts/${orderId}.pdf`);

  if (!fs.existsSync(receiptPath)) {
    console.error(`Receipt not found at path: ${receiptPath}`);
    return next(new ErrorHandler("Receipt not found", 404));
  }

  res.setHeader("Content-Type", "application/pdf");
  res.download(receiptPath, `${orderId}-receipt.pdf`, (err) => {
    if (err) {
      console.error(`Error while downloading receipt: ${err.message}`);
      return next(new ErrorHandler("Error while downloading receipt", 500));
    }
  });
});

exports.GetOrderCoop = asyncHandler(async (req, res, next) => {
  const Orders = await orderProcess.getCoopOrderById(req.params.id);

  return Orders?.length === STATUSCODE.ZERO
      ? next(new ErrorHandler("No User Order Found", STATUSCODE.NOT_FOUND))
      : SuccessHandler(res, "All orders fetched successfully", Orders);
});

exports.getDailySalesReport = asyncHandler(async (req, res, next) => {
  try {
    const report = await orderProcess.getDailySalesReport();
    
    if (!report || report.length === 0) {
      return next(new ErrorHandler("No sales data found for today", STATUSCODE.NOT_FOUND));
    }

    return SuccessHandler(res, "Daily sales report fetched successfully", report);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.getWeeklySalesReport = asyncHandler(async (req, res, next) => {
  try {
    const report = await orderProcess.getWeeklySalesReport();
    
    if (!report || report.length === 0) {
      return next(new ErrorHandler("No sales data found for the last week", STATUSCODE.NOT_FOUND));
    }

    return SuccessHandler(res, "Weekly sales report fetched successfully", report);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.getMonthlySalesReport = asyncHandler(async (req, res, next) => {
  try {
    const report = await orderProcess.getMonthlySalesReport();
    
    if (!report || report.length === 0) {
      return next(new ErrorHandler("No sales data found for this month", STATUSCODE.NOT_FOUND));
    }

    return SuccessHandler(res, "Monthly sales report fetched successfully", report);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.getCoopDashboardData = asyncHandler(async (req, res, next) => {
  try {
    const dashboardData = await orderProcess.getCoopDashboardData(req.params.id);

    if (!dashboardData) {
      return next(new ErrorHandler("No dashboard data found", 404));
    }

    return SuccessHandler(res, "Dashboard data fetched successfully", dashboardData);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.getOverallDashboardData = asyncHandler(async (req, res, next) => {
  console.log("Fetching overall dashboard data")
  try {
    const dashboardData = await orderProcess.getOverallDashboardData();

    if (!dashboardData) {
      return next(new ErrorHandler("No dashboard data found", 404));
    }

    return SuccessHandler(res, "Dashboard data fetched successfully", dashboardData);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.onlinePayment = asyncHandler(async (req, res, next) => {
  try {
    const paymentUrl = await orderProcess.onlinePaymentProcess(req);

    return SuccessHandler(res, "Payment URL generated successfully", paymentUrl);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.paymentStatus = asyncHandler(async (req, res, next) => {
  try {
    const paymentStatus = await orderProcess.getPaymentIntentProcess(req.params.id);

    return SuccessHandler(res, "Payment status fetched successfully", paymentStatus);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});