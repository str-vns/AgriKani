const axios = require("axios");
const Delivery = require("../models/delivery");
const { STATUSCODE } = require("../constants/index");
const moment = require('moment');

const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0); 

const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

exports.failedAllDeliveries = async () => {
  
    const deliveries = await Delivery.find({
        createdAt: { $gte: startOfDay, $lt: endOfDay },
        status: { $ne: "delivered" }
      }).lean().exec();
    if (!deliveries) throw new ErrorHandler(`No deliveries today found`); 

    const updatedDeliveries = await Delivery.updateMany(
        { _id: { $in: deliveries.map(delivery => delivery._id) } }, 
        { $set: { status: "failed" } }, 
        { new: true }
      ).lean().exec();
  
      return updatedDeliveries;
   
   return deliveries; 
};
