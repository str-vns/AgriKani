const asyncHandler = require("express-async-handler");
const Order = require("../models/order");
const Wallet = require("../models/wallets");
const Notification = require("../models/notification");
const Member = require("../models/members");
const Inventory = require("../models/inventoryM");
const Delivery = require("../models/delivery");
const User = require("../models/user");
const Product = require("../models/product")
const Transaction = require("../models/transaction");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");
const Farm = require("../models/farm");
const generateReceiptPDF = require("../utils/pdfreceipts");
const path = require("path");
const fs = require("fs");
const { sendEmail } = require("../utils/sendMail");
const admin = require('firebase-admin');
const Paymongo = require('paymongo');
const paymongoInstance = new Paymongo(process.env.PAYMONGO_TEST_KEY);
const axios = require("axios");


// Create a new order
exports.createOrderProcess = async ({ orderItems, shippingAddress, paymentMethod, totalPrice,shippingPrice, user, payStatus  }) => {
  console.log(user)
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
      throw new ErrorHandler( "User not found", 404);
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
    payStatus,
    shippingPrice,
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

    if (matchedOrderItem && matchedOrderItem.orderStatus !== 'Cancelled') {
      try {
        const inventory = await Inventory.findById(req.body.inventoryProduct);
        console.log("Inventory:", inventory);
        if (!inventory) {
          console.warn(`Product with ID ${req.body.inventoryProduct} not found.`);
        } else {
          inventory.quantity += matchedOrderItem.quantity;
          await inventory.save();
        }

        // order.totalPrice -= matchedOrderItem.price * matchedOrderItem.quantity;


        const remainingItemsInCoop = order.orderItems.filter(
          item => item.coopUser.toString() === matchedOrderItem.coopUser.toString() &&
                  item.inventoryProduct.toString() !== req.body.inventoryProduct &&
                  item.orderStatus !== 'Cancelled'
        );

        console.log("Remaining items in coop:", remainingItemsInCoop.length);
        let shippingAddition = 0; 
        if (remainingItemsInCoop.length === 0) {
          order.totalPrice -= 75; 
          order.shippingPrice -= 75;
          shippingAddition = 75;
        }

        const member = await Member.findOne({ userId: order.user, coopId: matchedOrderItem.coopUser });

        const taxMultiplier = member ? 0 : 0.12; 

        const deductedAmount = parseFloat((matchedOrderItem.price * matchedOrderItem.quantity * (1 + taxMultiplier)).toFixed(2));

      if( order.paymentMethod === "paymaya" || order.paymentMethod === "gcash" ){
        await Transaction.create({
          user: order.user,
          type: "REFUND",
          amount: deductedAmount + shippingAddition,
          paymentMethod: req.body.paymentMethod,
          accountName: req.body.accountName,
          accountNumber: req.body.accountNumber,
          transactionStatus: "PENDING",
          cancelledId: req.body.cancelledId,
        })
      }


order.totalPrice -= deductedAmount;

// const remainingTaxableTotal = order.orderItems
//   .filter(item => item.orderStatus !== 'Cancelled') 
//   .reduce((acc, item) => acc + item.price * item.quantity, 0);

// const newTaxAmount = remainingTaxableTotal * taxMultiplier;

// order.totalPrice = remainingTaxableTotal + newTaxAmount;

// if (remainingTaxableTotal === 0) {
//   order.totalPrice = 0;
// }

      } catch (error) {
        console.error(`Error replenishing stock for product ${matchedOrderItem.product}:`, error);
      }
    }
  }

  order.orderItems.forEach((item) => {
    // Match the order item by inventory product
    if (item.inventoryProduct.toString() === req.body.inventoryProduct) {
      console.log(item, "Matched Order Item");
  
      // If the order status has changed
      if (item.orderStatus !== req.body.orderStatus) {
        item.orderStatus = req.body.orderStatus;
  
        // If the new status is 'Delivered', set the deliveredAt timestamp
        if (req.body.orderStatus === 'Delivered') {
          item.deliveredAt = Date.now();
        }
      }
    }
  });

  const allItemsDelivered = order.orderItems.every(item => item.orderStatus === 'Delivered');
  
  if (allItemsDelivered) {
    order.payStatus = 'Paid';
    order.paymentAt = Date.now(); 
  }
  
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
        // inventory.quantity -= matchedItem.quantity;
        const isMember = await Member.exists({ userId: order.user._id, coopId: farm._id });

        const filteredItems = order.orderItems.filter(item => 
          item.coopUser.toString() === farm._id.toString()
        );

        const totalItem = filteredItems.reduce((acc, item) => 
          item.orderStatus !== "Cancelled" ? acc + item.price * item.quantity : acc, 0
        );
  
        const uniqueCoops = new Set(filteredItems.map(item => item.coopUser.toString()));
        const shippingFee = uniqueCoops.size * 75;
  
        const taxRate = isMember ? 0 : 0.12;
        const tax = totalItem * taxRate;

    // const totalPrice = order.orderItems.reduce((acc, item) => acc + item.quantity * item.inventoryProduct.price, 0);

    const totalPrice = totalItem + shippingFee + tax

    if( order.paymentMethod === "paymaya" || order.paymentMethod === "gcash" ){
      await Wallet.findOneAndUpdate(
        { user: farm.user },
        { 
          $inc: { balance: totalPrice } 
        }
      );
    }

    const receiptFolder = path.join(__dirname, "../receipts");
    if (!fs.existsSync(receiptFolder)) {
      fs.mkdirSync(receiptFolder);
    }
    const receiptPath = path.join(receiptFolder, `${order._id}.pdf`);
    await generateReceiptPDF(order, receiptPath);
   
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
  
      console.log(farm.user)
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

  const filteredOrders = await Promise.all(
    orders.map(async (order) => {
   
      const isMember = await Member.exists({ userId: order.user._id, coopId: Coopinfo._id });

      const filteredItems = order.orderItems.filter(item => 
        item.coopUser.toString() === Coopinfo._id.toString()
      );

      const totalItem = filteredItems.reduce((acc, item) => 
        item.orderStatus !== "Cancelled" ? acc + item.price * item.quantity : acc, 0
      );

      const uniqueCoops = new Set(filteredItems.map(item => item.coopUser.toString()));
      const shippingFee = uniqueCoops.size * 75;

      const taxRate = isMember ? 0 : 0.12;
      const tax = totalItem * taxRate;

      return {
        ...order,
        orderItems: filteredItems,
        totalItem,
        shippingFee,
        tax,
        totalAmount: totalItem + shippingFee + tax,
      };
    })
  );

  return filteredOrders.filter(order => order.orderItems.length > 0);
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

  const filteredOrders = await Promise.all(
    orders.map(async (order) => {
   
      const isMember = await Member.exists({ userId: order.user._id, coopId: Coopinfo._id });

      const filteredItems = order.orderItems.filter(item => 
        item.coopUser.toString() === Coopinfo._id.toString()
      );

      const totalItem = filteredItems.reduce((acc, item) => 
        item.orderStatus !== "Cancelled" ? acc + item.price * item.quantity : acc, 0
      );

      const uniqueCoops = new Set(filteredItems.map(item => item.coopUser.toString()));
      const shippingFee = uniqueCoops.size * 75;

      const taxRate = isMember ? 0 : 0.12;
      const tax = totalItem * taxRate;

      return {
        ...order,
        orderItems: filteredItems,
        totalItem,
        shippingFee,
        tax,
        totalAmount: totalItem + shippingFee + tax,
      };
    })
  );

  return filteredOrders.filter(order => order.orderItems.length > 0);
};

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

exports.getCoopDashboardData = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ErrorHandler(`Invalid User ID: ${userId}`, 400);
  }

  const coopInfo = await Farm.findOne({ user: userId });
  if (!coopInfo) {
    throw new ErrorHandler(`Cooperative not found for this user`, 404);
  }

  console.log("✅ Cooperative ID:", coopInfo._id);

  try {
    const deliveries = await Delivery.find({ coopId: coopInfo._id })
      .populate("orderItems.product")
      .lean();

    // Filter only delivered deliveries
    const deliveredDeliveries = deliveries.filter(
      (d) => d.status === "delivered"
    );

    // Total Revenue
    const totalRevenue = deliveredDeliveries.reduce(
      (sum, d) => sum + d.totalAmount,
      0
    );
    console.log("💰 Total Revenue:", totalRevenue);

    // Total Deliveries
    const totalOrders = deliveredDeliveries.length;
    console.log("📊 Total Deliveries:", totalOrders);

    // Total Customers
    const totalCustomers = new Set(deliveredDeliveries.map((d) => d.userId.toString())).size;
    console.log("👥 Total Customers:", totalCustomers);

    // Order Status Counts
    const orderStatusCounts = deliveries.reduce((counts, d) => {
      counts[d.status] = (counts[d.status] || 0) + 1;
      return counts;
    }, {});
    console.log("📌 Delivery Status Counts:", orderStatusCounts);

    // Date Calculations
    const today = new Date();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfWeek.getDate() - 7);

    const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    endOfCurrentMonth.setHours(23, 59, 59, 999);

    const revenueThisWeek = deliveredDeliveries
      .filter((d) => new Date(d.createdAt) >= startOfWeek)
      .reduce((sum, d) => sum + d.totalAmount, 0);

    const revenueLastWeek = deliveredDeliveries
      .filter(
        (d) =>
          new Date(d.createdAt) >= startOfLastWeek &&
          new Date(d.createdAt) < startOfWeek
      )
      .reduce((sum, d) => sum + d.totalAmount, 0);

    console.log("📅 Revenue This Week:", revenueThisWeek);
    console.log("📅 Revenue Last Week:", revenueLastWeek);

    // Aggregated Sales (Day, Week, Month, Year)
    // Aggregation to fetch sales per day (Monday-Sunday)
    // Aggregation to fetch sales per day (May 1-31)
    const salesPerDay = await Delivery.aggregate([
      {
        $match: {
          coopId: coopInfo._id,
          status: "delivered",
          createdAt: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
        },
      },
      {
        $project: {
          dayOfMonth: { $dayOfMonth: "$createdAt" },
          totalAmount: 1,
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: {
            dayOfMonth: "$dayOfMonth",
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { "_id.dayOfMonth": 1 },
      },
    ]);

// Aggregation to fetch sales per month (May 2025)
const salesPerMonth = await Delivery.aggregate([
  {
    $match: {
      coopId: coopInfo._id,
      status: "delivered",
    },
  },
  {
    $group: {
      _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
      totalSales: { $sum: "$totalAmount" },
    },
  },
  {
    $sort: { "_id.year": 1, "_id.month": 1 },
  },
]);

// Aggregation to fetch sales per year (2025)
const salesPerYear = await Delivery.aggregate([
  {
    $match: {
      coopId: coopInfo._id,
      status: "delivered",
    },
  },
  {
    $group: {
      _id: { year: { $year: "$createdAt" } },
      totalSales: { $sum: "$totalAmount" },
    },
  },
  {
    $sort: { "_id.year": 1 },
  },
]);

// Format Sales Per Day (May 1-31)
// Assuming salesPerDay contains _id with dayOfMonth, month, and year
const formattedSalesPerDay = [];

if (salesPerDay.length > 0) {
  const { month, year } = salesPerDay[0]._id; // Get the current month/year from the first item
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Get the number of days in the given month/year
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const sale = salesPerDay.find((sale) => sale._id.dayOfMonth === i);
    formattedSalesPerDay.push({
      day: `${monthNames[month - 1]} ${i}`,
      totalSales: sale ? sale.totalSales : 0,
    });
  }
}

console.log("📅 Sales Per Day (May 1-31):", formattedSalesPerDay);

// Format Sales Per Month (May 2025)
const formattedSalesPerMonth = salesPerMonth.map((sale) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];
  return {
    month: `${monthNames[sale._id.month - 1]} ${sale._id.year}`,
    totalSales: sale.totalSales,
  };
});
console.log("📅 Sales Per Month:", formattedSalesPerMonth);

// Format Sales Per Year (2025)
const formattedSalesPerYear = salesPerYear.map((sale) => {
  return {
    year: sale._id.year,
    totalSales: sale.totalSales,
  };
});
console.log("📅 Sales Per Year:", formattedSalesPerYear);


    // Top 5 Selling Products
    const topSellingProducts = await Delivery.aggregate([
      { $unwind: "$orderItems" },
      {
        $match: {
          coopId: coopInfo._id,
          status: "delivered",
        },
      },
      {
        $group: {
          _id: "$orderItems.product",
          totalSold: { $sum: "$orderItems.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
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
          _id: 1,
          productName: "$productDetails.productName",
          totalSold: 1,
          image: "$productDetails.image",
        },
      },
    ]);

    // All Product Sales Map
    const allProductSales = await Delivery.aggregate([
      { $unwind: "$orderItems" },
      {
        $match: {
          coopId: coopInfo._id,
          status: "delivered",
        },
      },
      {
        $group: {
          _id: "$orderItems.product",
          totalSold: { $sum: "$orderItems.quantity" },
        },
      },
    ]);

    const productSalesMap = {};
    allProductSales.forEach((item) => {
      productSalesMap[item._id.toString()] = item.totalSold;
    });

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      orderStatusCounts,
      revenueThisWeek,
      revenueLastWeek,
      salesPerDay,
      salesPerMonth,
      salesPerYear,
      formattedSalesPerDay,
      formattedSalesPerMonth,
      formattedSalesPerYear,
      topSellingProducts,
      productSalesMap,
    };
    
  } catch (error) {
    console.error("❌ Error fetching dashboard data:", error);
    throw new ErrorHandler("Error processing dashboard data", 500);
  }
};

exports.getOverallDashboardData = async () => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Fetch only delivered deliveries
    const deliveries = await Delivery.find({ status: "delivered" })
      .populate({
        path: "orderId",
        populate: {
          path: "orderItems.product",
          model: "product",
        },
      })
      .populate("coopId");

    console.log("Total Delivered Deliveries:", deliveries.length);

    const filterByDate = (date) => deliveries.filter(d => new Date(d.createdAt) >= date);

    const calcRevenue = (items) => items.reduce((sum, item) => sum + item.totalAmount, 0);

    const dailyDeliveries = filterByDate(startOfDay);
    const weeklyDeliveries = filterByDate(startOfWeek);
    const monthlyDeliveries = filterByDate(startOfMonth);
    const yearlyDeliveries = filterByDate(startOfYear);

    const dailySales = calcRevenue(dailyDeliveries);
    const weeklySales = calcRevenue(weeklyDeliveries);
    const monthlySales = calcRevenue(monthlyDeliveries);
    const yearlySales = calcRevenue(yearlyDeliveries);

    console.log("Daily Sales:", dailySales);
    console.log("Weekly Sales:", weeklySales);
    console.log("Monthly Sales:", monthlySales);
    console.log("Yearly Sales:", yearlySales);

    const totalRevenue = calcRevenue(deliveries);
    const totalOrders = deliveries.length;

    console.log("Total Revenue:", totalRevenue);
    console.log("Total Orders:", totalOrders);

    // Flatten all orderItems
    const allOrderItems = deliveries.flatMap(delivery => delivery.orderId?.orderItems || []);
    const productSalesMap = new Map();

    allOrderItems.forEach(item => {
      if (item.product) {
        const key = item.product._id.toString();
        if (!productSalesMap.has(key)) {
          productSalesMap.set(key, {
            productId: key,
            productName: item.product.productName,
            totalQuantitySold: 0,
          });
        }
        productSalesMap.get(key).totalQuantitySold += item.quantity;
      }
    });

    const rankedProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.totalQuantitySold - a.totalQuantitySold)
      .slice(0, 5);

    console.log("Top Selling Products:", rankedProducts);

    // Top Coops based on revenue
    const coopRevenueMap = new Map();

    deliveries.forEach(delivery => {
      const coopId = delivery.coopId?._id?.toString();
      if (!coopId) return;
      if (!coopRevenueMap.has(coopId)) {
        coopRevenueMap.set(coopId, {
          coopId: coopId,
          coopName: delivery.coopId.farmName,
          totalRevenue: 0,
        });
      }
      coopRevenueMap.get(coopId).totalRevenue += delivery.totalAmount;
    });

    const topCoops = Array.from(coopRevenueMap.values())
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);

    console.log("Top Coops:", topCoops);

    return {
      salesTrends: {
        daily: dailySales,
        weekly: weeklySales,
        monthly: monthlySales,
        yearly: yearlySales,
      },
      totalRevenue,
      totalOrders,
      rankedProducts,
      topCoops,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Error processing dashboard data");
  }
};

exports.onlinePaymentProcess = async (req, res) => {
  console.log("Request Body:", req.body);

  try {
    const { type, amount, email, name, phone, isMobile } = req.body;

    // ✅ Validate payment type
    if (!type || !["gcash", "paymaya"].includes(type)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // ✅ Convert and validate amount
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // ✅ Create payment method
    const paymentMethodResponse = await paymongoInstance.paymentMethods.create({
      data: {
        attributes: {
          type,
          billing: {
            name: name || "Unknown User",
            email: email || "noemail@example.com",
            phone: phone || "09123456789",
          },
        },
      },
    });

    if (!paymentMethodResponse?.data?.id) {
      console.error("Payment method creation failed:", paymentMethodResponse);
      return res.status(500).json({ message: "Failed to create payment method" });
    }

    const paymentMethodId = paymentMethodResponse.data.id;

    // ✅ Create payment intent
    const paymentIntentResponse = await paymongoInstance.paymentIntents.create({
      data: {
        attributes: {
          amount: amountNumber * 100, // Convert to cents
          currency: 'PHP',
          payment_method_allowed: ['gcash', 'paymaya'],
          capture_type: 'automatic',
        },
      },
    });

    if (!paymentIntentResponse?.data?.id) {
      console.error("Payment intent creation failed:", paymentIntentResponse);
      return res.status(500).json({ message: "Failed to create payment intent" });
    }

    const paymentIntentId = paymentIntentResponse.data.id;

    const returnUrl = isMobile ? process.env.MOBILE_URL_NAVIGATE : process.env.WEB_URL_NAVIGATE;
    
    // ✅ Attach Payment Method to Payment Intent
    const attachResponse = await paymongoInstance.paymentIntents.attach(paymentIntentId, {
      data: {
        attributes: {
          payment_method: paymentMethodId,
          return_url: returnUrl,
        },
      },
    });

    console.log("Attach Response:", attachResponse);
    if (!attachResponse?.data) {
      console.error("Failed to attach payment method:", attachResponse);
      return res.status(500).json({ message: "Failed to attach payment method" });
    }

    return(attachResponse.data);

  } catch (error) {
    console.error("Paymongo error:", error);

    // ✅ Improved error handling
    if (error.response?.data) {
      throw new ErrorHandler(error.response.data, error.response.status);
    } else if (error.type === "AuthenticationError") {
      throw new ErrorHandler("Authentication failed", 401);
    } else if (error.type === "InvalidRequestError") {
      throw new ErrorHandler(error.errors, 400);
    } else {
      throw new ErrorHandler("An unexpected error occurred", 500);
    }
  }
};

exports.getPaymentIntentProcess = async (id) => {
    try {
      const { data } = await axios.get(`https://api.paymongo.com/v1/payment_intents/${id}`, {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_TEST_KEY).toString('base64')}`, 
        },
      });
      console.log("Payment Intent Data:", data);
      return data?.data?.attributes?.payments[0]?.attributes?.status || "failed"; 
    } catch (error) {
      console.error('Error retrieving payment intent:', error);
      return "failed"; 
    }
  };

