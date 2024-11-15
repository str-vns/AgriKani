const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/errorHandler");
const SuccessHandler = require("../utils/successHandler");
const orderProcess = require("../process/orderProcess");
const { STATUSCODE } = require("../constants/index");
const { sendOrderReceipt } = require("../receipt/receipt");  // Import sendOrderReceipt

// Create a new order
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice, user } = req.body;
  const orderDetails = req.body;

  try {
    // Create the order
    const createdOrder = await orderProcess.createOrderProcess({
      user,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    // Send receipt email after order creation
    const orderReceiptDetails = {
      orderId: createdOrder._id,   // Assuming the order has an ID
      totalAmount: createdOrder.totalPrice,   // Assuming totalPrice is part of the order
      items: createdOrder.orderItems,   // Assuming orderItems is part of the order
    };

    // Send the email receipt to the user's email
    await sendOrderReceipt(user.email, orderReceiptDetails);

    // Return success response
    return SuccessHandler(res, "Order has been created successfully and receipt sent.", { order: createdOrder });
  } catch (error) {
    return next(new ErrorHandler(error.message, error.statusCode || STATUSCODE.INTERNAL_SERVER_ERROR));
  }
});

// Update order status
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await orderProcess.updateOrderStatusProcess(orderId, status);
    return SuccessHandler(res, "Order status updated successfully", updatedOrder);
  } catch (error) {
    return next(new ErrorHandler(error.message, error.statusCode || STATUSCODE.INTERNAL_SERVER_ERROR));
  }
});

// Delete an order
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  try {
    await orderProcess.deleteOrderProcess(orderId);
    return SuccessHandler(res, "Order deleted successfully");
  } catch (error) {
    return next(new ErrorHandler(error.message, error.statusCode || STATUSCODE.INTERNAL_SERVER_ERROR));
  }
});

// Get order by user ID
exports.GetOrderUser = asyncHandler(async (req, res, next) => {
  const Orders = await orderProcess.getOrderById(req.params.id);
  
  return Orders?.length === STATUSCODE.ZERO
      ? next(new ErrorHandler("No User Order Found", STATUSCODE.NOT_FOUND))
      : SuccessHandler(res, "All orders fetched successfully", Orders);
});