const asyncHandler = require("express-async-handler");
const Order = require("../models/order");
const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");

// Create a new order
exports.createOrderProcess = async ({ orderItems, shippingAddress, paymentMethod, totalPrice, user }) => {
  if (!orderItems || orderItems.length === 0) {
    throw new ErrorHandler("No order items provided", 400);
  }

  const userDoc = await User.findById(user);
  if (!userDoc) {
    throw new ErrorHandler("User not found", 404);
  }

  const order = new Order({
    user: userDoc._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
  });

  return await order.save();
};

// Update order status
exports.updateOrderStatusProcess = async (orderId, status) => {
  if (!['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
    throw new ErrorHandler("Invalid status", 400);
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ErrorHandler("Order not found", 404);
  }

  order.orderStatus = status;
  if (status === 'Delivered') {
    order.deliveredAt = Date.now();
  }

  return await order.save();
};

// Delete an order
exports.deleteOrderProcess = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ErrorHandler("Order not found", 404);
  }

  await order.remove();
};

// Get order by user ID
exports.getOrderById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorHandler(`Invalid User ID: ${id}`, 400);
  }

  const orders = await Order.find({ user: id })
    .populate({ path: "user", select: "firstName lastName email image.url" })
    .populate({ path: "orderItems.product", select: "productName pricing price image.url" })
    .populate({ path: "shippingAddress", select: "address city phoneNum" })
    .lean()
    .exec();

  if (!orders) {
    throw new ErrorHandler(`No orders found for user ID: ${id}`, 404);
  }

  return orders;
};