const asyncHandler = require("express-async-handler");
const Order = require("../models/order");
const ErrorHandler = require("../utils/errorHandler");
const SuccessHandler = require("../utils/successHandler");
const { STATUSCODE } = require("../constants/index");
const mongoose = require('mongoose');

// Create a new order
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice, user } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return next(new ErrorHandler("No order items provided", STATUSCODE.BAD_REQUEST));
  }

  // Fetch the full user information using req.body.user
  const userDoc = await User.findById(user);  // Here, you access the user ID from the body
  if (!userDoc) {
    return next(new ErrorHandler("User not found", STATUSCODE.NOT_FOUND));
  }

  const order = new Order({
    user: userDoc._id,  // Use the user ID from the fetched user
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
  });

  const createdOrder = await order.save();
  return SuccessHandler(res, "Order has been created successfully", createdOrder);
});


const jwt = require("jsonwebtoken"); // Import JWT if needed for token decoding

// Create a new order
// exports.createOrder = asyncHandler(async (req, res, next) => {
//   const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;
  
//   // Extract the user from the decoded token (you need to verify the token in your middleware)
//   const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
  
//   if (!token) {
//     return next(new ErrorHandler("Authorization token not found", STATUSCODE.UNAUTHORIZED));
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Decode the token
//     const userId = decoded.userId;  // Assuming userId is in the token payload

//     const userDoc = await User.findById(userId);  // Use the user ID from the token
//     if (!userDoc) {
//       return next(new ErrorHandler("User not found", STATUSCODE.NOT_FOUND));
//     }

//     // Check if orderItems is empty
//     if (!orderItems || orderItems.length === 0) {
//       return next(new ErrorHandler("No order items provided", STATUSCODE.BAD_REQUEST));
//     }

//     const order = new Order({
//       user: userDoc._id,  // Use the user ID from the token
//       orderItems,
//       shippingAddress,
//       paymentMethod,
//       totalPrice,
//     });

//     const createdOrder = await order.save();
//     return SuccessHandler(res, "Order has been created successfully", createdOrder);

//   } catch (error) {
//     return next(new ErrorHandler("Invalid token or user not found", STATUSCODE.UNAUTHORIZED));
//   }
// });


// Get a single order by ID

// Controller

exports.getOrderById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new ErrorHandler(`Invalid Farm ID: ${id}`);
  
    const orders = await Order.find({ user: id })
        .populate({ path: "user", select: "firstName lastName email image.url" })  
        .populate({ path: "orderItems.product", select: "productName pricing price image.url" })
        .populate({ path: "shippingAddress", select: "address city phoneNum" })
        .lean()
        .exec();
  
    if (!orders) throw new ErrorHandler(`Orders not exist with ID: ${id}`);
  
    return orders;
  };


  

// Get all orders for a user
// exports.getUserOrders = asyncHandler(async (req, res, next) => {
//     const { user } = req.body;  // Make sure the user is sent in the body
  
//     // Check if user is provided
//     if (!user) {
//       return next(new ErrorHandler("User ID is required", STATUSCODE.BAD_REQUEST));
//     }
  
//     const orders = await Order.find({ user: user })  // Use the user ID from req.body
//       .populate("user", "firstName lastName email")  // Populate user details
//       .populate("orderItems.product", "productName pricing");  // Populate product details
  
//     if (!orders || orders.length === 0) {
//       return next(new ErrorHandler("No orders found", STATUSCODE.NOT_FOUND));
//     }
  
//     return SuccessHandler(res, "Orders fetched successfully", orders);
//   });
  
// Get all orders for a user
exports.getUserOrders = asyncHandler(async (req, res, next) => {
    // Assuming user ID comes from the authenticated user (e.g., JWT token)
    const userId = req.user ? req.user.id : req.params.userId;  // Use req.user.id or userId from params
    
    // Check if user ID is provided
    if (!userId) {
      return next(new ErrorHandler("User ID is required", STATUSCODE.BAD_REQUEST));
    }
  
    // Find orders for the user
    const orders = await Order.find({ user: userId }) // Use the user ID from req.user or req.params
      .populate("user", "firstName lastName email") // Populate user details
      .populate("orderItems.product", "productName pricing"); // Populate product details
  
    // If no orders are found, return a not found error
    if (!orders || orders.length === 0) {
      return next(new ErrorHandler("No orders found", STATUSCODE.NOT_FOUND));
    }
  
    // Send the successful response with the fetched orders
    return SuccessHandler(res, "Orders fetched successfully", orders);
  });
  



// Update order status
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found", STATUSCODE.NOT_FOUND));
  }

  order.orderStatus = status;
  if (status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();
  return SuccessHandler(res, "Order status updated successfully", updatedOrder);
});