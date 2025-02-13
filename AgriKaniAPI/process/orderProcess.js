const asyncHandler = require("express-async-handler");
const Order = require("../models/order");
const Notification = require("../models/notification");
const User = require("../models/user");
const Product = require("../models/product")
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");
const Inventory = require("../models/inventoryM");
const Farm = require("../models/farm");
const generateReceiptPDF = require("../utils/pdfreceipts");
const path = require("path");
const fs = require("fs");
const { sendEmail } = require("../utils/sendMail");
const admin = require('firebase-admin');

// Create a new order
exports.createOrderProcess = async ({ orderItems, shippingAddress, paymentMethod, totalPrice, user }) => {
  if (!orderItems || orderItems.length === 0) {
    throw new ErrorHandler("No order items provided", 400);
  }

  const userDoc = await User.findById(user);
  if (!userDoc) {
    throw new ErrorHandler("User not found", 404);
  }

  for (const item of orderItems) {
    const userId = await Farm.findById(item.coopUser);
    const singleUser = await User.findById(userId?.user).lean().exec();
    const inventory = await Inventory.findById(item.inventoryProduct)
      .populate({ path: "productId", select: "productName" });
      const product = await Product.findById(item.product);

    if (!singleUser) {
      throw new ErrorHandler(STATUSCODE.NOT_FOUND, "User not found");
    }

    if (!inventory) {
      throw new ErrorHandler(`Inventory with ID ${item.inventoryProduct} not found`, 404);
    }

    if (inventory.quantity !== 0) {
      inventory.quantity -= item.quantity;
      console.log("Quantity has been deducted");
    }

    if (inventory.quantity <= 5) {
      await Notification.create({
        title: "Low Stock",
        content: `Inventory ${inventory.productId?.productName}, ${inventory.unitName} ${inventory.metricUnit} has only ${inventory.quantity} items left`,
        user: userId?.user,
        type: "inventory",
      });

      await sendFcmNotification(singleUser, "Low Stock Alert", 
        `Inventory ${inventory.productId?.productName} ${inventory.unitName} ${inventory.metricUnit} is running low. Only ${inventory.quantity} items left.`);
    }

    // if (inventory.quantity === 0) {
    //   inventory.status = 'inactive';
    //   await Notification.create({
    //     title: "Product Out of Stock",
    //     content: `Inventory ${inventory.productId?.productName}, ${inventory.unitName} ${inventory.metricUnit} is out of stock`,
    //     user: userId?.user,
    //     type: "inventory",
    //   });

    //   await sendFcmNotification(singleUser, "Out of Stock Alert", 
    //     `Inventory ${inventory.productId?.productName}  ${inventory.unitName} ${inventory.metricUnit} is out of stock.`);
    // }

    await inventory.save();
    const inventoryItems = await Inventory.find({ productId: inventory.productId?._id });
    const allQuantitiesZero = inventoryItems.every(item => item.quantity === 0);
    console.log("All quantities zero:", allQuantitiesZero);
    if (allQuantitiesZero) {
      product.activeAt = "inactive";
      await product.save();
    }
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

const sendFcmNotification = async (user, title, content) => {
  if (!user.deviceToken || user.deviceToken.length === 0) {
    console.log("No device tokens found for the user.");
    return;
  }

  const message = {
    data: {
      key1: "value1",
      key2: "value2",
      key3: "value3",
    },
    notification: {
      title,
      body: content,
    },
    apns: {
      payload: {
        aps: {
          badges: 42,
        },
      },
    },
    tokens: user.deviceToken, 
  };

  try {
    console.log("Sending notification to the user:", user.email);
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log("Notification sent:", response);

    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.log("Error sending to token:", response.responses[idx].error);
          failedTokens.push(user.deviceToken[idx]);
        }
      });
      console.log("Failed tokens:", failedTokens);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

exports.updateOrderStatusProcess = async (id, req) => {
  console.log(id, req.body.inventoryProduct)

   if (!['Pending', 'Processing', 'Shipping', 'Delivered', 'Cancelled'].includes(req.body.orderStatus)) {
     throw new ErrorHandler("Invalid status", 400);
   }
  
  const order = await Order.findById(id);
  if (!order) {
    throw new ErrorHandler("Order not found", 404);
  }

  if (req.body.orderStatus === 'Cancelled') {
    const matchedOrderItem = order.orderItems.find(item => item.inventoryProduct.toString() === req.body.inventoryProduct);
      if (matchedOrderItem.orderStatus !== 'Cancelled') {
        try {
          const inventory = await Inventory.findById(req.body.inventoryProduct);
  
          if (!inventory) {
            console.warn(`Product with ID ${req.body.inventoryProduct} not found.`);
          }
          inventory.quantity += matchedOrderItem.quantity;
          order.totalPrice -= matchedOrderItem.price;
          await inventory.save();
        } catch (error) {
          console.error(`Error replenishing stock for product ${item.product}:`, error);
        }
      }
  }

  order.orderItems.forEach((item) => {
  
    if (item.inventoryProduct.toString() === req.body.inventoryProduct) {
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
    .populate({ path: "orderItems.inventoryProduct", select: "price metricUnit unitName" })
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  if (!orders) {
    throw new ErrorHandler(`No orders found for user ID: ${id}`, 404);
  }

  return orders;
};

exports.updateOrderStatusCoop = async (id, req) => {
  if (!['Pending', 'Processing', 'Shipping', 'Delivered', 'Cancelled'].includes(req.body.orderStatus)) {
    throw new ErrorHandler("Invalid status", 400);
  }

  const order = await Order.findById(id)
  .populate({ path: "orderItems.inventoryProduct", select: "metricUnit unitName price" })
  .populate({ path: "orderItems.product", select: "coop productName image.url" })
  .populate({ path: "shippingAddress", select: "address city postalCode" })
  .populate({ path: "user", select: "firstName lastName email phoneNum deviceToken" })
  if (!order) {
    throw new ErrorHandler("Order not found", 404);
  }

  const inventorys = req.body.InvId;
  const matchedOrderItems = order.orderItems.filter(item =>
    inventorys.includes(item.inventoryProduct?._id?.toString())
  );
  
  for (const matchedItem of matchedOrderItems) {
   
    if (matchedItem.orderStatus !== req.body.orderStatus) {
      const inventory = await Inventory.findById(matchedItem.inventoryProduct);
      const product = await Product.findById(matchedItem.product._id);
      const farm = await Farm.findById(product.coop);
    
      matchedItem.orderStatus = req.body.orderStatus;
    
      if (req.body.orderStatus === 'Processing') {
        inventory.quantity -= matchedItem.quantity;

    const totalPrice = order.orderItems.reduce((acc, item) => acc + item.quantity * item.inventoryProduct.price, 0);
    const receiptFolder = path.join(__dirname, "../receipts");
    if (!fs.existsSync(receiptFolder)) {
      fs.mkdirSync(receiptFolder);
    }
    const receiptPath = path.join(receiptFolder, `${order._id}.pdf`);
    await generateReceiptPDF(order, receiptPath);
   
    // Send receipt via email
    const email = order.user.email;
    const mailOptions = {
      to: email,
      subject: `Receipt for Order #${order._id}`,
      html: `
      <p>Dear ${order.user.firstName},</p>
  <p>Thank you for your purchase! Please find your order receipt attached.</p>
  <h4>Order Details:</h4>
  <p>
    <strong>Order ID:</strong> ${order._id}<br>
    <strong>Total Price:</strong> ₱${totalPrice}<br>
    <strong>Payment Method:</strong> ${order.paymentMethod}<br>
    <strong>Shipping Address:</strong><br>
    ${order.user.firstName} ${order.user.lastName}<br>
    ${order.shippingAddress.address}, ${order.shippingAddress.city}, 
    ${order.shippingAddress.postalCode}<br>
    <strong>Phone:</strong> ${order.user.phoneNum}
  </p>
  <h4>Products Ordered:</h4>
  <ul>
    ${order.orderItems
      .map(
        (item) => `        
        <li>
          ${item.product.productName} - Quantity: ${item.quantity} - Unit Price: ₱${item.inventoryProduct.price}
        </li>`
      )
      .join("")}
  </ul>
  <h4>Total Purchase: ₱${totalPrice}</h4>
  <p>We appreciate your business and hope to serve you again soon!</p>
      `,
      };
  
      await sendEmail(mailOptions);
   
      }
  
      if (req.body.orderStatus === 'Delivered') {
        matchedItem.deliveredAt = Date.now();
      }
  
    }
  }

  await order.save();

 return order
}

exports.getShippedOrdersProcess = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorHandler(`Invalid User ID: ${id}`, 400);
  }
  const Coopinfo = await Farm.findOne({ user: id });
  if (!Coopinfo) {
    throw new ErrorHandler(`Cooperative not found with ID: ${id}`, 404);
  }

  const orders = await Order.find({ "orderItems.coopUser": Coopinfo._id, "orderItems.orderStatus": "Shipping" })
    .populate({ path: "user", select: "firstName lastName email image.url phoneNum" })
    .populate({ path: "orderItems.inventoryProduct", select: "metricUnit unitName" })
    .populate({ path: "orderItems.product", select: "coop productName pricing price image.url", match: { coop: Coopinfo._id } })
    .populate({ path: "shippingAddress", select: "address city phoneNum, barangay" })
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  if (!orders || orders.length === 0) {
    throw new ErrorHandler(`No orders found for user ID: ${id}`, 404);
  }

 const filteredOrders = orders.map(order => {
    const filteredItems = order.orderItems.filter(item => 
        item.coopUser.toString() === Coopinfo._id.toString() &&
        item.orderStatus === "Shipping"
    );
    return {
        ...order,
        orderItems: filteredItems,
        totalAmount: filteredItems.reduce((acc, item) =>
          item.orderStatus !== "Cancelled" ? acc + item.price * item.quantity : acc,
      0)
    };
}).filter(order => order.orderItems.length > 0);
  
  return filteredOrders;
}

exports.getCoopOrderById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorHandler(`Invalid User ID: ${id}`, 400);
  }
  const Coopinfo = await Farm.findOne({ user: id });
  if (!Coopinfo) {
    throw new ErrorHandler(`Cooperative not found with ID: ${id}`, 404);
  }

  

  const orders = await Order.find({ "orderItems.coopUser": Coopinfo._id })
    .populate({ path: "user", select: "firstName lastName email image.url" })
    .populate({ path: "orderItems.inventoryProduct", select: "metricUnit unitName" })
    .populate({ path: "orderItems.product", select: "coop productName pricing price image.url", match: { coop: Coopinfo._id } })
    .populate({ path: "shippingAddress", select: "address city phoneNum" })
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  if (!orders || orders.length === 0) {
    throw new ErrorHandler(`No orders found for user ID: ${id}`, 404);
  }
console.log
  const filteredOrders = orders.map(order => {
    const filteredItems = order.orderItems.filter(item => 
        item.coopUser.toString() === Coopinfo._id.toString()
    );
    return {
        ...order,
        orderItems: filteredItems,
        totalAmount: filteredItems.reduce((acc, item) => 
          item.orderStatus !== "Cancelled" ? acc + item.price * item.quantity : acc, 
      0)
    };
}).filter(order => order.orderItems.length > 0);

  console.log("Filtered Orders:", filteredOrders);
  return filteredOrders;
}

exports.getRankedProducts = async () => {
  try {
  
    const rankedProducts = await Order.aggregate([
      { $unwind: "$orderItems" }, 
      {
        $group: {
          _id: "$orderItems.product",  
          totalQuantitySold: { $sum: "$orderItems.quantity" },  
        }
      },
      {
        $sort: { totalQuantitySold: -1 }  
      },
      {
        $lookup: {
          from: "products",  
          localField: "_id",  
          foreignField: "_id", 
          as: "productDetails" 
        }
      },
      { 
        $unwind: "$productDetails"  
      },
      {
        $project: {
          productId: "$_id",  
          totalQuantitySold: 1,  
          name: "$productDetails.name",  
          price: "$productDetails.price",  
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

exports.getCoopDashboardData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorHandler(`Invalid Cooperative ID: ${id}`, 400);
  }

  const coopInfo = await Farm.findOne({ user: id });
  if (!coopInfo) {
    throw new ErrorHandler(`Cooperative not found with ID: ${id}`, 404);
  }

  console.log("Cooperative ID:", coopInfo._id);

  // Filter orders by status "Shipping"
  try {
    const orders = await Order.find({ 
      "orderItems.coopUser": coopInfo._id, 
      "orderItems.orderStatus": "Shipping" 
    })
      .populate("orderItems.product")
      .lean();

    console.log("Fetched Orders:", orders.length);

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalOrders = orders.length;

    // Top-selling products (only for delivered orders)
    const rankedProducts = await Order.aggregate([
      { $unwind: "$orderItems" },
      { 
        $match: { 
          "orderItems.coopUser": coopInfo._id,
          "orderItems.orderStatus": "Shipping" 
        } 
      },
      {
        $group: {
          _id: "$orderItems.product",
          totalQuantitySold: { $sum: "$orderItems.quantity" },
        },
      },
      {
        $sort: { totalQuantitySold: -1 },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          productName: "$productDetails.productName",
          totalQuantitySold: 1,
        },
      },
    ]);

    console.log("Ranked Products:", rankedProducts);

    // Sales trends (only for delivered orders)
    // Sales trends (only for delivered orders)
const currentDate = new Date();
const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);

const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(currentDate.getDate() - 7);
sevenDaysAgo.setHours(0, 0, 0, 0);

const dailySales = await Order.aggregate([
  { 
    $match: { 
      "orderItems.orderStatus": "Shipping",
      createdAt: { $gte: startOfDay }
    } 
  },
  { $group: { _id: null, revenue: { $sum: "$totalPrice" } } },
]);

const weeklySales = await Order.aggregate([
  { 
    $match: { 
      "orderItems.orderStatus": "Shipping",
      createdAt: { $gte: sevenDaysAgo }
    } 
  },
  { $group: { _id: null, revenue: { $sum: "$totalPrice" } } },
]);

const monthlySales = await Order.aggregate([
  { 
    $match: { 
      "orderItems.orderStatus": "Shipping",
      createdAt: { $gte: startOfMonth }
    } 
  },
  { $group: { _id: null, revenue: { $sum: "$totalPrice" } } },
]);

    console.log("Daily Sales:", dailySales);
    console.log("Weekly Sales:", weeklySales);
    console.log("Monthly Sales:", monthlySales);

    return {
      totalRevenue,
      totalOrders,
      rankedProducts,
      salesTrends: {
        daily: dailySales[0]?.revenue || 0,
        weekly: weeklySales[0]?.revenue || 0,
        monthly: monthlySales[0]?.revenue || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new ErrorHandler("Error processing dashboard data", 500);
  }
};

exports.getOverallDashboardData = async () => {
  try {
    // Your existing logic to fetch dashboard data
    const orders = await Order.find({ "orderItems.orderStatus": "Shipping" })
      .populate("orderItems.product")
      .lean();

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalOrders = orders.length;

    const rankedProducts = await Order.aggregate([
      { $unwind: "$orderItems" },
      { $match: { "orderItems.orderStatus": "Shipping" } },
      {
        $group: {
          _id: "$orderItems.product",
          totalQuantitySold: { $sum: "$orderItems.quantity" },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
  { $limit: 5 }, 
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          productName: "$productDetails.productName",
          totalQuantitySold: 1,
        
        },
      },
    ]);

    const currentDate = new Date();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(currentDate.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailySales = await Order.aggregate([
      { $match: { "orderItems.orderStatus": "Shipping", createdAt: { $gte: startOfDay } } },
      { $group: { _id: null, revenue: { $sum: "$totalPrice" } } },
    ]);

    const weeklySales = await Order.aggregate([
      { $match: { "orderItems.orderStatus": "Shipping", createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: null, revenue: { $sum: "$totalPrice" } } },
    ]);

    const monthlySales = await Order.aggregate([
      { $match: { "orderItems.orderStatus": "Shipping", createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, revenue: { $sum: "$totalPrice" } } },
    ]);

    return {
      totalRevenue,
      totalOrders,
      rankedProducts,
      salesTrends: {
        daily: dailySales[0]?.revenue || 0,
        weekly: weeklySales[0]?.revenue || 0,
        monthly: monthlySales[0]?.revenue || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching overall dashboard data:", error);
    throw new Error("Error processing dashboard data");
  }
};
