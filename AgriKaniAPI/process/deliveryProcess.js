const Coop = require("../models/farm");
const Delivery = require("../models/delivery");
const Order = require("../models/order");
const Driver = require("../models/driver");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE, GENDER } = require("../constants/index");
const { default: mongoose } = require("mongoose");

const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0); 

const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

exports.createDeliveryProcess = async (req) => {
   
    const orderid = await Order.findById(req.body.orderId).lean().exec();
    if (!orderid) { 
        throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Order not found");
    }

    const coopid = await Coop.findOne({ user: req.body.coopId }).lean().exec();

    if (!coopid) {  
        throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Coop not found");
    }

    const couriers  = await Driver.find({ coopId: coopid._id }).lean().exec();

    if (!couriers) {
        throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "Courier not found");
    }

      const orders = await Order.findOne({ "orderItems.coopUser": coopid._id, _id: orderid._id })
        .populate({ path: "user", select: "firstName lastName email image.url" })
        .populate({ path: "orderItems.inventoryProduct", select: "metricUnit unitName" })
        .populate({ path: "shippingAddress", select: "address city barangay phoneNum latitude longitude" })
        .sort({ createdAt: -1 })
        .lean()
        .exec();

        const filteredItems = orders.orderItems.filter(item => 
            item.coopUser.toString() === coopid._id.toString()
        );
 
        const filteredOrder = {
            ...orders,
            orderItems: filteredItems
        };

        const dailyDeliveries  = await Delivery.find({ createdAt: { $gte: startOfDay, $lte: endOfDay }}).lean().exec();

        const courierAssignments = {};
        for (const courier of couriers) {
          courierAssignments[courier._id] = dailyDeliveries.filter(
            delivery => delivery.assignedTo.toString() === courier._id.toString()
          ).length;
        }

        
        const sortedCouriers = couriers.sort((a, b) => {
            return courierAssignments[a._id] - courierAssignments[b._id];
          });

          let assignedCourier = null;
          for (const courier of sortedCouriers) {
            const formattedCity = filteredOrder.shippingAddress.city.replace(/ City$/i, '');
 
            const isLocationMatch = courier.assignedLocation.some(location => 
                location.barangay === filteredOrder.shippingAddress.barangay &&
                location.city.replace(/ City$/i, '') === formattedCity
              );
            console.log(isLocationMatch, "isLocationMatch");

            if (isLocationMatch &&
              courier.isAvailable === true
            ) {
              assignedCourier = courier;
              break;
            }
          }
      
          if (!assignedCourier) {
            throw new ErrorHandler(STATUSCODE.BAD_REQUEST, "No courier available for this location");
              
        }

          console.log(assignedCourier, "assignedCourier");
        
        {
    const delivery = await Delivery.create({
        orderId: orderid._id,
        coopId: coopid._id,
        orderItems: filteredItems.map(item => ({
        product: item.product,
        quantity: item.quantity, 
        inventoryProduct: item.inventoryProduct,
    })),
        shippingAddress: filteredOrder.shippingAddress._id,
        userId: filteredOrder.user._id,
        deliveryLocation: {
            Latitude: filteredOrder.shippingAddress.latitude,
            Longitude: filteredOrder.shippingAddress.longitude,
        },
        assignedTo: assignedCourier._id,
    });
   

   await Order.findByIdAndUpdate(orderid._id, {
        "orderItems.$[elem].deliveryId": delivery._id,
    }, 
    {
        new: true,
        runValidators: true,
        arrayFilters: 
        [ {
            "elem.coopUser" : coopid._id
        }]
    }).lean().exec();
    
    return delivery;   

 }
}

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
    .populate("assignedTo", "firstName lastName email image.url userId phoneNum") 
    .lean().exec();
    if (!deliveries) throw new ErrorHandler(`Delivery not found with ID: ${id}`);

    return deliveries;
}

exports.getDeliveryDriverProcess = async (id) => {

    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ErrorHandler(`Invalid user ID: ${id}`);

    const drivers = await Driver.findOne({ userId: id }).lean().exec();
    if (!drivers) throw new ErrorHandler(`Driver not found with ID: ${id}`);

  
    const deliveries = await Delivery.find({
        assignedTo: drivers._id,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
        status: { $ne: "delivered" }
      })
      .populate("orderId", "totalPrice paymentMethod")
      .populate("coopId")
      .populate("userId", "firstName lastName email image.url phoneNum")
      .populate("orderItems.product", "productName pricing price image.url ")
      .populate("orderItems.inventoryProduct", "metricUnit unitName")
      .populate("shippingAddress", "address city barangay")
      .populate("assignedTo", "firstName lastName email image.url userId") 
      .lean().exec();
    
    return deliveries;
}

exports.getDeliveryCompletedProcess = async(id) => {
    const drivers = await Driver.findOne({ userId: id }).lean().exec();
    if (!drivers) throw new ErrorHandler(`Driver not found with ID: ${id}`);

    const deliveries = await Delivery.find({
        assignedTo: drivers._id,
        status: "delivered",
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      })
      .populate("orderId", "totalPrice paymentMethod")
      .populate("coopId")
      .populate("userId", "firstName lastName email image.url phoneNum")
      .populate("orderItems.product", "productName pricing price image.url ")
      .populate("orderItems.inventoryProduct", "metricUnit unitName")
      .populate("shippingAddress", "address city barangay")
      .populate("assignedTo", "firstName lastName email image.url")
      .lean().exec();
    
    return deliveries;
}

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
        createdAt: { $gte: startOfDay, $lte: endOfDay }
    })
    .lean()
    .exec();

    return deliveries
}

exports.UpdateDeliveryStatusProcess = async (id, req) => {
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ErrorHandler(`Invalid Delivery ID: ${id}`);

    const delivery = await Delivery.findByIdAndUpdate
    (id, { status: req.body.status }, { new: true }).lean().exec();

    if ( req.body.status === "delivered") {
        await Order.findByIdAndUpdate(delivery.orderId, {
            "orderItems.$[elem].orderStatus": "Delivered",
        }, 
        {
            new: true,
            runValidators: true,
            arrayFilters: 
            [ {
                "elem.deliveryId" : id
            }]
        }).lean().exec();

        await Delivery.findByIdAndUpdate(id, { deliveredAt: Date.now() }).lean().exec();

    }

    if (!delivery) throw new ErrorHandler(`Delivery not found with ID: ${id}`);

    return delivery;
}

exports.getDeliveryCoopDriverProcess = async (id) => {
    const coop = await Coop.findOne({ user: id }).lean().exec();
    if (!coop) throw new ErrorHandler(`Coop not found with ID: ${id}`);

    const drivers = await Delivery.find({ coopId: coop._id }).lean().exec();
    if (!drivers) throw new ErrorHandler(`Driver not found with ID: ${id}`);

    return drivers;
}

exports.qrCodeDeliveredProcess = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ErrorHandler(`Invalid Delivery ID: ${id}`);

    const delivery = await Delivery.findByIdAndUpdate
    (id, { status: "delivered", deliveredAt: Date.now() }, { new: true }).lean().exec();
    if (!delivery) throw new ErrorHandler(`Delivery not found with ID: ${id}`);

    
    await Order.findByIdAndUpdate(delivery.orderId, {
        "orderItems.$[elem].orderStatus": "Delivered",
    }, 
    {
        new: true,
        runValidators: true,
        arrayFilters: 
        [ {
            "elem.deliveryId" : id
        }]
    }).lean().exec();

    return delivery;

}

exports.getDeliveryThisMonthProcess = async (id) => {

    const deliveries = await Delivery.find({
        assignedTo: id,
        createdAt: { $gte: startOfDay, $lte: endOfDay }
    })
    .populate("assignedTo", "firstName lastName image.url")
    .lean()
    .exec();

    return deliveries
}

exports.removeDeliveryProcess = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ErrorHandler(`Invalid Delviery ID: ${id}`);

    const deliveryExist = await Delivery.findById(id).lean().exec();
    if (!deliveryExist) throw new ErrorHandler(`Delviery not exist with ID: ${id}`);

    try {
        await Promise.all([
         Delivery.deleteOne({ _id: id }).lean().exec(),
        ]);
    
  
        return deliveryExist;
      } catch (error) {

        throw new ErrorHandler('An error occurred while removing the delivery process');
      }
}

