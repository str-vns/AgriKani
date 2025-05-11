const Coop = require("../models/farm");
const Member = require("../models/members");
const Delivery = require("../models/delivery");
const Order = require("../models/order");
const Driver = require("../models/driver");
const User = require("../models/user");
const Notification = require("../models/notification");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE, GENDER } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const { sendFcmNotification } = require("../utils/generalHelpers")

const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);

const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

//OLD - Manual Delivery Process
// exports.createDeliveryProcess = async (req) => {

//     console.log(req.body, "req.body");
//     const orderid = await Order.findById(req.body.orderId).lean().exec();
//     if (!orderid) {
//         throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Order not found");
//     }

//     const coopid = await Coop.findOne({ user: req.body.coopId }).lean().exec();

//     if (!coopid) {
//         throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Coop not found");
//     }

//     const couriers  = await Driver.find({ coopId: coopid._id }).lean().exec();

//     if (!couriers) {
//         throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Courier not found");
//     }

//       const orders = await Order.findOne({ "orderItems.coopUser": coopid._id, _id: orderid._id })
//         .populate({ path: "user", select: "firstName lastName email image.url" })
//         .populate({ path: "orderItems.inventoryProduct", select: "metricUnit unitName" })
//         .populate({ path: "shippingAddress", select: "address city barangay phoneNum latitude longitude" })
//         .sort({ createdAt: -1 })
//         .lean()
//         .exec();

//         const filteredItems = orders.orderItems.filter(item =>
//             item.coopUser.toString() === coopid._id.toString()
//         );

//         const filteredOrder = {
//             ...orders,
//             orderItems: filteredItems
//         };

//         const dailyDeliveries  = await Delivery.find({ createdAt: { $gte: startOfDay, $lte: endOfDay }}).lean().exec();

//         const courierAssignments = {};
//         for (const courier of couriers) {
//           courierAssignments[courier._id] = dailyDeliveries.filter(
//             delivery => delivery.assignedTo.toString() === courier._id.toString()
//           ).length;
//         }

//         const sortedCouriers = couriers.sort((a, b) => {
//             return courierAssignments[a._id] - courierAssignments[b._id];
//           });

//           let assignedCourier = null;
//           for (const courier of sortedCouriers) {
//             const formattedCity = filteredOrder.shippingAddress.city.replace(/ City$/i, '');

//             const isLocationMatch = courier.assignedLocation.some(location =>
//                 location.barangay === filteredOrder.shippingAddress.barangay &&
//                 location.city.replace(/ City$/i, '') === formattedCity
//               );
//             // console.log(isLocationMatch, "isLocationMatch");

//             if (isLocationMatch &&
//               courier.isAvailable === true
//             ) {
//               assignedCourier = courier;
//               break;
//             }
//           }

//           if (!assignedCourier) {
//             throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "No courier available for this location");

//         }

//         //   console.log(assignedCourier, "assignedCourier");

//         {
//     const delivery = await Delivery.create({
//         orderId: orderid._id,
//         coopId: coopid._id,
//         orderItems: filteredItems.map(item => ({
//         product: item.product,
//         quantity: item.quantity,
//         inventoryProduct: item.inventoryProduct,
//     })),
//         shippingAddress: filteredOrder.shippingAddress._id,
//         userId: filteredOrder.user._id,
//         deliveryLocation: {
//             Latitude: filteredOrder.shippingAddress.latitude,
//             Longitude: filteredOrder.shippingAddress.longitude,
//         },
//            paymentMethod: orderid.paymentMethod,
//         payStatus: orderid.payStatus,
//         totalAmount: req.body.totalAmount,
//         assignedTo: assignedCourier._id,
//     });

//    await Order.findByIdAndUpdate(orderid._id, {
//         "orderItems.$[elem].deliveryId": delivery._id,
//     },
//     {
//         new: true,
//         runValidators: true,
//         arrayFilters:
//         [ {
//             "elem.coopUser" : coopid._id
//         }]
//     }).lean().exec();

//     return delivery;

//  }
// }

//NEW - Automated Delivery Process
exports.createDeliveryProcess = async () => {
  const orderid = await Order.find().lean().exec();
  const coopid = await Coop.find().lean().exec();

  const ordersResult = [];
  const ValidatedOrders = [];

  await Promise.all(
    orderid.map(async (order) => {
      await Promise.all(
        coopid.map(async (coop) => {
          const orders = await Order.findOne({
            "orderItems.coopUser": coop._id,
            _id: order._id,
          })
            .populate({
              path: "user",
              select: "firstName lastName email image.url",
            })
            .populate({
              path: "orderItems.inventoryProduct",
              select: "metricUnit unitName",
            })
            .populate({
              path: "shippingAddress",
              select: "address city barangay phoneNum latitude longitude",
            })
            .sort({ createdAt: -1 })
            .lean()
            .exec();

          if (orders) {
            ordersResult.push(orders);
          }
        })
      );
    })
  );

  const filteredOrders = await Promise.all(
    ordersResult.map(async (order) => {
      const filteredItems = order.orderItems.filter(
        (item) => item.orderStatus === "Shipping"
      );

      if (filteredItems.length > 0) {
        return {
          ...order,
          orderItems: filteredItems,
        };
      }

      return null;
    })
  );

  const validFilteredOrders = filteredOrders.filter((order) => order !== null);
  ValidatedOrders.push(...validFilteredOrders);
 
  for (const order of ValidatedOrders) {
    const coopGroups = {};

    for (const item of order.orderItems) {
      if (item.orderStatus !== "Shipping") continue;
      const coopId = item.coopUser.toString();
      if (!coopGroups[coopId]) {
        coopGroups[coopId] = [];
      }
      coopGroups[coopId].push(item);
    }

    for (const [coopId, items] of Object.entries(coopGroups)) {
      const city = order.shippingAddress.city.replace(/ City$/i, "");
      const barangay = order.shippingAddress.barangay;
     
      //total amount calculation
      const isMember = !!(await Member.findOne({
        userId: order.user,
        coopId: coopId,
      })
        .lean()
        .exec());
      const taxMulti = isMember ? 0 : 0.12;
      let totalAmount = 0;

      for (const item of items) {
        totalAmount += item.price * item.quantity * (1 + taxMulti);
      }

      const shippingFee = 75; 
      const totalAmountWithShipping = totalAmount + shippingFee;
      
      const courierResult = await Driver.find({ coopId: coopId , isAvailable: true, approvedAt: { $ne: null }, }).lean().exec();

      const courierAssignments = {};

      const dailyDeliveries = await Delivery.find({ createdAt: { $gte: startOfDay, $lte: endOfDay }, }).lean().exec();

      for (const courier of courierResult) {
        const assignedCount = dailyDeliveries.filter(
          (delivery) => delivery.assignedTo.toString() === courier._id.toString()
        ).length;
        
        if (assignedCount < courier.maxCapacity) {
          courierAssignments[courier._id] = assignedCount;
        }
      }
      
      const sortedCouriers = courierResult.sort((a, b) => {
                    return courierAssignments[a._id] - courierAssignments[b._id];
                  });
  
      const courier = sortedCouriers.find(courier => 
        courier.coopId.toString() === coopId && 
        courier.assignedLocation.some(location =>
          location.barangay === barangay &&
          location.city.replace(/ City$/i, '') === city
        )
      ) 


        if (!courier) continue
  
        const deliveryExists = await Delivery.exists({
            orderId: order._id,
            coopId,
            createdAt: { $gte: startOfDay, $lte: endOfDay },
          });
        
          if (!deliveryExists && courier) {
           const delivery = await Delivery.create({
            orderId: order._id,
            coopId: coopId,
            orderItems: items.map((item) => ({
              product: item.product,
              quantity: item.quantity,
              inventoryProduct: item.inventoryProduct,
            })),
            shippingAddress: order.shippingAddress._id,
            userId: order.user._id,
            deliveryLocation: {
              Latitude: order.shippingAddress.latitude,
              Longitude: order.shippingAddress.longitude,
            },
            paymentMethod: order.paymentMethod,
            payStatus: order.payStatus,
            totalAmount: totalAmountWithShipping,
            assignedTo: courier._id,
           })

           
           for (const item of items) {
            await Order.findByIdAndUpdate(order._id, {
              $set: {
                "orderItems.$[elem].deliveryId": delivery._id,
              },
            }, {
              new: true,
              runValidators: true,
              arrayFilters: [
                { "elem.coopUser": coopId, "elem.inventoryProduct": item.inventoryProduct }
              ],
            }).lean().exec();
          }

            const userCourier =  await User.findById(courier.userId).lean().exec(); 

           sendFcmNotification(userCourier, "New Delivery Assigned", `You have a new delivery assigned to you. Order ID: ${order._id}`)
          
           await Notification.create({
            user: userCourier._id,
            title: "New Delivery Assigned",
            content: `You have a new delivery assigned to you. Order ID: ${order._id}`,
            type: "delivery",
           })
        }


    }
  }
};

exports.getDeliveryTrackingProcess = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Order ID: ${id}`);

  const deliveries = await Delivery.findById(id)
    .populate("orderId", "totalPrice paymentMethod")
    .populate("coopId")
    .populate("userId", "firstName lastName email image.url phoneNum")
    .populate("orderItems.product", "productName pricing price image.url ")
    .populate("orderItems.inventoryProduct", "metricUnit unitName")
    .populate("shippingAddress", "address city barangay")
    .populate(
      "assignedTo",
      "firstName lastName email image.url userId phoneNum"
    )
    .lean()
    .exec();
  if (!deliveries) throw new ErrorHandler(`Delivery not found with ID: ${id}`);

  return deliveries;
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

exports.getDeliveryDriverProcess = async (id, req) => {
  console.log(req.query, "req.query");

  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid user ID: ${id}`);

  const drivers = await Driver.findOne({ userId: id }).lean().exec();
  if (!drivers) throw new ErrorHandler(`Driver not found with ID: ${id}`);

  const deliveries = await Delivery.find({
    assignedTo: drivers._id,
    createdAt: { $gte: startOfDay, $lte: endOfDay },
    status: { $ne: "delivered" },
  })
    .populate("orderId", "totalPrice paymentMethod")
    .populate("coopId")
    .populate("userId", "firstName lastName email image.url phoneNum")
    .populate("orderItems.product", "productName pricing price image.url")
    .populate("orderItems.inventoryProduct", "metricUnit unitName")
    .populate("shippingAddress", "address city barangay")
    .populate("assignedTo", "firstName lastName email image.url userId")
    .lean()
    .exec();

  // Map and calculate distance for each delivery
  const deliveriesWithDistances = deliveries.map((delivery) => {
    const deliveryLat = parseFloat(delivery.deliveryLocation.Latitude);
    const deliveryLon = parseFloat(delivery.deliveryLocation.Longitude);

    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    if (isNaN(userLat) || isNaN(userLon)) {
      throw new ErrorHandler("Invalid latitude or longitude provided.");
    }

    const distance = calculateDistance(
      userLat,
      userLon,
      deliveryLat,
      deliveryLon
    );
    return { ...delivery, distance };
  });

  const nearbyDeliveries = deliveriesWithDistances.filter((delivery) => {
    return delivery.distance <= 70;
  });

  const sortedDeliveries = nearbyDeliveries.sort(
    (a, b) => a.distance - b.distance
  );

  return sortedDeliveries;
};

exports.getDeliveryCompletedProcess = async (id) => {
  const drivers = await Driver.findOne({ userId: id }).lean().exec();
  if (!drivers) throw new ErrorHandler(`Driver not found with ID: ${id}`);

  const deliveries = await Delivery.find({
    assignedTo: drivers._id,
    status: "delivered",
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  })
    .populate("orderId", "totalPrice paymentMethod")
    .populate("coopId")
    .populate("userId", "firstName lastName email image.url phoneNum")
    .populate("orderItems.product", "productName pricing price image.url ")
    .populate("orderItems.inventoryProduct", "metricUnit unitName")
    .populate("shippingAddress", "address city barangay")
    .populate("assignedTo", "firstName lastName email image.url")
    .lean()
    .exec();

  return deliveries;
};

exports.getDeliveryHistoryProcess = async (id) => {
  const drivers = await Driver.findOne({ userId: id }).lean().exec();
  if (!drivers) throw new ErrorHandler(`Driver not found with ID: ${id}`);

  const deliveries = await Delivery.find({
    assignedTo: drivers._id,
  })
    .lean()
    .exec();

  return deliveries;
};

exports.getDeliveryCoopHistoryProcess = async (id) => {
  const coop = await Coop.findOne({ user: id }).lean().exec();
  if (!coop) throw new ErrorHandler(`Coop not found with ID: ${id}`);

  const deliveries = await Delivery.find({
    coopId: coop._id,
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  })
    .lean()
    .exec();

  return deliveries;
};

exports.UpdateDeliveryStatusProcess = async (id, req) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Delivery ID: ${id}`);

  const delivery = await Delivery.findByIdAndUpdate(
    id,
    { status: req.body.status },
    { new: true }
  )
    .lean()
    .exec();

  if (req.body.status === "delivered") {
    await Order.findByIdAndUpdate(
      delivery.orderId,
      {
        "orderItems.$[elem].orderStatus": "Delivered",
      },
      {
        new: true,
        runValidators: true,
        arrayFilters: [
          {
            "elem.deliveryId": id,
          },
        ],
      }
    )
      .lean()
      .exec();

    await Delivery.findByIdAndUpdate(id, { deliveredAt: Date.now() })
      .lean()
      .exec();
  }

  if (!delivery) throw new ErrorHandler(`Delivery not found with ID: ${id}`);

  return delivery;
};

exports.getDeliveryCoopDriverProcess = async (id) => {
  const coop = await Coop.findOne({ user: id }).lean().exec();
  if (!coop) throw new ErrorHandler(`Coop not found with ID: ${id}`);

  const drivers = await Delivery.find({ coopId: coop._id }).lean().exec();
  if (!drivers) throw new ErrorHandler(`Driver not found with ID: ${id}`);

  return drivers;
};

exports.qrCodeDeliveredProcess = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Delivery ID: ${id}`);

  const delivery = await Delivery.findByIdAndUpdate(
    id,
    { status: "delivered", deliveredAt: Date.now() },
    { new: true }
  )
    .lean()
    .exec();
  if (!delivery) throw new ErrorHandler(`Delivery not found with ID: ${id}`);

  await Order.findByIdAndUpdate(
    delivery.orderId,
    {
      "orderItems.$[elem].orderStatus": "Delivered",
    },
    {
      new: true,
      runValidators: true,
      arrayFilters: [
        {
          "elem.deliveryId": id,
        },
      ],
    }
  )
    .lean()
    .exec();

  return delivery;
};

exports.getDeliveryThisMonthProcess = async (id) => {
  const deliveries = await Delivery.find({
    assignedTo: id,
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  })
    .populate("assignedTo", "firstName lastName image.url")
    .populate("orderItems.product", "productName pricing price image.url")
    .populate("orderItems.inventoryProduct", "metricUnit unitName")
    .lean()
    .exec();

  return deliveries;
};

exports.removeDeliveryProcess = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Delviery ID: ${id}`);

  const deliveryExist = await Delivery.findById(id).lean().exec();
  if (!deliveryExist)
    throw new ErrorHandler(`Delviery not exist with ID: ${id}`);

  try {
    await Promise.all([Delivery.deleteOne({ _id: id }).lean().exec()]);

    return deliveryExist;
  } catch (error) {
    throw new ErrorHandler(
      "An error occurred while removing the delivery process"
    );
  }
};
