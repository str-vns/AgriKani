const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/errorHandler");
const SuccessHandler = require("../utils/successHandler");
const orderProcess = require("../process/orderProcess");
const { STATUSCODE } = require("../constants/index");
const generateReceiptPDF = require("../utils/pdfreceipts");
const sendEmailWithAttachment = require("../utils/emailreceipts");
const User = require("../models/user");
const path = require("path");

// Create a new order
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice, user } = req.body;
  try {
    const createdOrder = await orderProcess.createOrderProcess({
      user,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const userRecord = await User.findById(createdOrder.user);
    if (!userRecord) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Generate PDF receipt
    const receiptPath = path.join(__dirname, `../receipts/${createdOrder._id}.pdf`);
    generateReceiptPDF(createdOrder, receiptPath);

    // Send email with receipt
    const userEmail = userRecord.email; // Ensure this retrieves the correct email
    const emailText = `
      Thank you for your order!
      Order ID: ${createdOrder._id}
      Total Price: $${createdOrder.totalPrice}
      Payment Method: ${createdOrder.paymentMethod}
    `;
    await sendEmailWithAttachment(
      userEmail,
      "Order Receipt",
      emailText,
      receiptPath
    );


    return SuccessHandler(res, "Order has been created successfully", createdOrder);
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

const sendOrderReceipt = async (userEmail, orderDetails) => {
  const receiptFolder = path.join(__dirname, "../receipts");

  // Ensure the receipts folder exists
  if (!fs.existsSync(receiptFolder)) {
    fs.mkdirSync(receiptFolder);
  }

  // Generate PDF receipt path
  const receiptPath = path.join(receiptFolder, `${orderDetails._id}.pdf`);

  try {
    // Generate the receipt PDF
    await generateReceiptPDF(orderDetails, receiptPath);

    // Send email with attachment
    const emailSubject = `Receipt for Order #${orderDetails._id}`;
    const emailText = `Thank you for your order! Your total amount is ₱${orderDetails.totalPrice}.`;

    await sendEmailWithAttachment(userEmail, emailSubject, emailText, receiptPath);
    console.log("Order receipt sent to:", userEmail);

  } catch (error) {
    console.error("Error sending receipt:", error);
  }
};