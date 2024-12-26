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
const sendEmailWithAttachment = require("../utils/emailreceipts");
const path = require("path");
const fs = require("fs");
const { coopSingle } = require("./farmInfoProcess");

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
    console.log(item, "Item");
    const inventory = await Inventory.findById(item.inventoryProduct);

    if (!inventory) {
      throw new ErrorHandler(`Inventory with ID ${item.product} not found`, 404);
    }

    if (inventory.quantity < item.quantity) {
      throw new ErrorHandler(
        `Insufficient stock for product ${inventory.productName}. Available stock: ${inventory.stock}`,
        400
      );
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
          // product.stock += matchedOrderItem.quantity;
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
    const userEmail = order.user.email;
    const emailSubject = `Receipt for Order #${order._id}`;
    const emailHtml = `
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
`;
    
    await sendEmailWithAttachment(userEmail, emailSubject, "", receiptPath, emailHtml);

   
        if (inventory.quantity === 0) {
          inventory.status = 'inactive';
       await Notification.create({
        title: "Product Out of Stock",
        content: `Inventory ${product.productName}, ${inventory.unitName} ${inventory.metricUnit}  is out of stock`,
        user: farm?.user,
        type: "product",

      });
        }
      }
  
      if (req.body.orderStatus === 'Delivered') {
        matchedItem.deliveredAt = Date.now();
      }
  
      await inventory.save();
      const inventoryItems = await Inventory.find({ productId: product._id });
      const allQuantitiesZero = inventoryItems.every(item => item.quantity === 0);
  
      if (allQuantitiesZero) {
        product.activeAt = "inactive";
        await product.save();
      }
    }
  }

  await order.save();

 return order
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
  console.log(Coopinfo._id, "Coopinfo")

  const filteredOrders = orders.map(order => {
    const filteredItems = order.orderItems.filter(item => 
        item.coopUser.toString() === Coopinfo._id.toString()
    );
    return {
        ...order,
        orderItems: filteredItems
    };
}).filter(order => order.orderItems.length > 0);
  
 console.log(filteredOrders, "Filtered Orders")
  return filteredOrders;
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


