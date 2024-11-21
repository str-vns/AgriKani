const asyncHandler = require("express-async-handler");
const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product")
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

  // Validate and update stock
  for (const item of orderItems) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new ErrorHandler(`Product with ID ${item.product} not found`, 404);
    }

    if (product.stock < item.quantity) {
      throw new ErrorHandler(
        `Insufficient stock for product ${product.productName}. Available stock: ${product.stock}`,
        400
      );
    }

    // Deduct stock
    product.stock -= item.quantity;
    await product.save();
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
// exports.updateOrderStatusProcess = async (orderId, status) => {
//   if (!['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
//     throw new ErrorHandler("Invalid status", 400);
//   }

//   const order = await Order.findById(orderId);
//   if (!order) {
//     throw new ErrorHandler("Order not found", 404);
//   }

//   order.orderStatus = status;
//   if (status === 'Delivered') {
//     order.deliveredAt = Date.now();
//   }

//   return await order.save();
// };

exports.updateOrderStatusProcess = async (id, req) => {
  console.log(req.body.productId, "Request body");

   if (!['Pending', 'Processing', 'Shipping', 'Delivered', 'Cancelled'].includes(req.body.orderStatus)) {
     throw new ErrorHandler("Invalid status", 400);
   }
  
  const order = await Order.findById(id);
  if (!order) {
    throw new ErrorHandler("Order not found", 404);
  }

  if (req.body.orderStatus === 'Cancelled') {
    const matchedOrderItem = order.orderItems.find(item => item.product.toString() === req.body.productId);
      if (matchedOrderItem.orderStatus !== 'Cancelled') {
        try {
          const product = await Product.findById(req.body.productId);
  
          if (!product) {
            console.warn(`Product with ID ${req.body.productId} not found.`);
          }
          product.stock += matchedOrderItem.quantity;
          order.totalPrice -= matchedOrderItem.price;
          await product.save();
        } catch (error) {
          console.error(`Error replenishing stock for product ${item.product}:`, error);
        }
      }
  }

  order.orderItems.forEach((item) => {
  
    if (item.product.toString() === req.body.productId) {
      console.log(item, "Matched Order Item");
  
      if (item.orderStatus !== req.body.orderStatus) {
        item.orderStatus = req.body.orderStatus;
  
        if (req.body.orderStatus === 'Delivered') {
          item.deliveredAt = Date.now();
        }
      }
    }
  });
  

  await order.save();

 return order
};


// Delete an order
// exports.deleteOrderProcess = async (orderId) => {
//   const order = await Order.findById(orderId);
//   if (!order) {
//     throw new ErrorHandler("Order not found", 404);
//   }

//   await order.remove();
// };
exports.deleteOrderProcess = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ErrorHandler("Order not found", 404);
  }

  // Replenish stock
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);

    if (product) {
      product.stock += item.quantity;
      await product.save();
    }
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
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  if (!orders) {
    throw new ErrorHandler(`No orders found for user ID: ${id}`, 404);
  }

  return orders;
};

exports.updateOrderStatusCoop = async (id, req) => {
  console.log(req.body.productId, "Request body");
   console.log(req.body.orderStatus, "Request body");
  if (!['Pending', 'Processing', 'Shipping', 'Delivered', 'Cancelled'].includes(req.body.orderStatus)) {
    throw new ErrorHandler("Invalid status", 400);
  }

  const order = await Order.findById(id);
  if (!order) {
    throw new ErrorHandler("Order not found", 404);
  }

  const products = req.body.productId;
  const matchedOrderItems = order.orderItems.filter(item =>
    products.includes(item.product.toString())
  );
  
  for (const matchedItem of matchedOrderItems) {
    if (matchedItem.orderStatus !== req.body.orderStatus) {
      const product = await Product.findById(matchedItem.product);
      

      matchedItem.orderStatus = req.body.orderStatus;
      product.stock -= matchedItem.quantity;
  
      if (req.body.orderStatus === 'Delivered') {
        matchedItem.deliveredAt = Date.now(); 
      }
  
      await product.save();
    }
  }
  

  await order.save();

 return order
}