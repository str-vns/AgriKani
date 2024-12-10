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

exports.getCoopOrderById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorHandler(`Invalid User ID: ${id}`, 400);
  }

  const orders = await Order.find({ "orderItems.productUser": id })
    .populate({ path: "user", select: "firstName lastName email image.url" })
    .populate({ path: "orderItems.product", select: "user productName pricing price image.url", match: { user: id } })
    .populate({ path: "shippingAddress", select: "address city phoneNum" })
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  if (!orders || orders.length === 0) {
    throw new ErrorHandler(`No orders found for user ID: ${id}`, 404);
  }

  const filteredOrders = orders.filter(order =>
    order.orderItems.every(item => item.productUser !== id)
  );

  return filteredOrders;
}

exports.getRankedProducts = async () => {
  try {
    // Aggregate orders to get the total quantity sold for each product
    const rankedProducts = await Order.aggregate([
      { $unwind: "$orderItems" },  // Deconstruct the orderItems array in each order
      {
        $group: {
          _id: "$orderItems.product",  // Group by product ID
          totalQuantitySold: { $sum: "$orderItems.quantity" },  // Sum the quantity sold for each product
        }
      },
      {
        $sort: { totalQuantitySold: -1 }  // Sort products by total quantity sold in descending order
      },
      {
        $lookup: {
          from: "products",  // Look up the product details from the "products" collection
          localField: "_id",  // Join on the product ID from the orderItems
          foreignField: "_id", // Match it with the _id field in the products collection
          as: "productDetails"  // The matched product will be placed in the productDetails array
        }
      },
      { 
        $unwind: "$productDetails"  // Flatten the productDetails array to get the product name directly
      },
      {
        $project: {
          productId: "$_id",  // Include the product ID
          totalQuantitySold: 1,  // Include the total quantity sold
          name: "$productDetails.name",  // Get the product name from the joined data
          price: "$productDetails.price",  // Optionally, include the price of the product
        }
      }
    ]);

    return rankedProducts;  // Return the ranked products
  } catch (error) {
    console.error("Error fetching ranked products:", error);
    throw error;  // Rethrow the error to be handled by the controller
  }
};

exports.getDailySalesReport = async () => {
  // Get the start of the current day (midnight)
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);  // Set the time to 00:00:00 (midnight)

  const currentDate = new Date();  // Current date and time

  return await Order.aggregate([
    { 
      $match: { 
        createdAt: { 
          $gte: startOfDay,  // Match orders from the start of the current day
          $lte: currentDate  // Until the current date (inclusive of time)
        } 
      } 
    },
    {
      $unwind: "$orderItems"  // Unwind the orderItems array to count each product separately
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },  // Sum of total price for the day
        totalQuantity: { $sum: "$orderItems.quantity" },  // Sum of quantities sold for the day
      },
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
        totalQuantity: 1,
      },
    },
  ]);
};

exports.getWeeklySalesReport = async () => {
  // Calculate the date 7 days ago from today
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);  // Subtract 7 days

  const currentDate = new Date(); // Current date

  return await Order.aggregate([
    { 
      $match: { 
        createdAt: { 
          $gte: sevenDaysAgo,  // Match orders from the last 7 days
          $lte: currentDate   // Until the current date
        } 
      } 
    },
    {
      $unwind: "$orderItems"  // Unwind the orderItems array to count each product separately
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" }, // Sum of total price
        totalQuantity: { $sum: "$orderItems.quantity" },  // Sum of all item quantities
      },
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
        totalQuantity: 1,
      },
    },
  ]);
};

exports.getMonthlySalesReport = async () => {
  // Get the first day of the current month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);  // Set the date to 1st of the current month
  startOfMonth.setHours(0, 0, 0, 0);  // Set time to midnight to get the start of the month

  const currentDate = new Date(); // Current date

  return await Order.aggregate([
    { 
      $match: { 
        createdAt: { 
          $gte: startOfMonth,  // Match orders from the start of the current month
          $lte: currentDate   // Until the current date
        } 
      } 
    },
    {
      $unwind: "$orderItems"  // Unwind the orderItems array to count each product separately
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" }, // Sum of total price
        totalQuantity: { $sum: "$orderItems.quantity" },  // Sum of all item quantities
      },
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
        totalQuantity: 1,
      },
    },
  ]);
};

