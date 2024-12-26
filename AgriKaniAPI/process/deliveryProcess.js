const Coop = require("../models/farm");
const Address = require("../models/address");
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

      const orders = await Order.findOne({ "orderItems.coopUser": coopid._id, _id: orderid._id })
        .populate({ path: "user", select: "firstName lastName email image.url" })
        .populate({ path: "orderItems.inventoryProduct", select: "metricUnit unitName" })
        .populate({ path: "shippingAddress", select: "address city phoneNum latitude longitude" })
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

    const delivery = await Delivery.create({
        orderId: orderid._id,
        coopId: coopid._id,
         orderItems: filteredItems.map(item => ({
        product: item.product,
        quantity: item.quantity, 
        inventoryProduct: item.inventoryProduct,
    })),
        userId: filteredOrder.user._id,
        deliveryLocation: {
            Latitude: filteredOrder.shippingAddress.latitude,
            Longitude: filteredOrder.shippingAddress.longitude,
        },
        assignedTo: req.body.assignedTo,
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

exports.getDeliveryTrackingProcess = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ErrorHandler(`Invalid Order ID: ${id}`);

    const deliveries = await Delivery.findById(id).lean().exec();
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
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      }).lean().exec();

    return deliveries;
}

exports.UpdateDeliveryStatusProcess = async (id, req) => {
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ErrorHandler(`Invalid Delivery ID: ${id}`);

    const delivery = await Delivery.findByIdAndUpdate
    (id, { status: req.body.status }, { new: true }).lean().exec();
    if (!delivery) throw new ErrorHandler(`Delivery not found with ID: ${id}`);

    return delivery;
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
