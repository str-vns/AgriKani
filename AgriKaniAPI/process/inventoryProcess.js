const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const Inventory = require("../models/inventoryM");
const Product = require("../models/product");
const Farm = require("../models/farm");
const Order = require("../models/order"); 
const { BadRequestErrorErrorCodeEnum } = require("xendit-node/invoice/models");

//create ...
exports.CreateInventoryProcess = async (req) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.productId))
        throw new ErrorHandler(`Invalid User ID: ${req.body.productId}`);
    const product = await Product.findById(req.body.productId).lean().exec();
    if (!product) throw new ErrorHandler(`Product not exist with ID: ${req.body.productId}`);

    if(product.activeAt === 'inactive') {
        const id = req.body.productId;

        const inventory = await Inventory.create({
            ...req.body,
        });

        await Product.findByIdAndUpdate(
            id,
            {
              $push: {
                    stock: inventory._id, 
                  },
              activeAt: 'active',
            },
            {
              new: true,
              runValidators: true,
            }
          )

        return inventory;
    } 
    else{
        const id = req.body.productId;

        const inventory = await Inventory.create({
            ...req.body,
        });

        await Product.findByIdAndUpdate(
            id,
            {
                $push: {
                    stock: inventory._id, 
                  },
            },
            {
              new: true,
              runValidators: true,
            }
          ) 

        return inventory;
    }
  
}

//Read ...
exports.GetAllInventoryInfo = async () => {
    const inventory = await Inventory.find()
        .sort({ createdAt: STATUSCODE.NEGATIVE_ONE })
        .lean()
        .exec();

    return inventory;
};

//Single ...
exports.GetSingleInventory = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ErrorHandler(`Invalid Inventory ID: ${id}`);

    const farm = await Farm.findOne({ user: id });

    if (farm) {
        const products = await Product.find({ coop: farm._id }).lean().exec();

        console.log(products, "All Products related to the farm");
        
        // Fetch inventories for the stock items of those products
        const inventories = await Inventory.find({
          _id: { $in: products.map((product) => product.stock).flat() },  
          quantity: 0
        })
        .populate({
          path: "productId",
          select: "productName",
        })
        .lean()
        .exec();
    
      return inventories;
    } else {
      console.log("Farm not found");
    }
}

//Update ...
exports.UpdateInventoryInfo = async (req, id) => {
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ErrorHandler(`Invalid Inventory ID: ${id}`);

    const inventoryExist = await Inventory.findById(id).lean().exec();
    if (!inventoryExist) throw new ErrorHandler(`Inventory not exist with ID: ${id}`);

    const product = await Product.findById(inventoryExist.productId).lean().exec();
 
    if(product.activeAt === 'inactive') {
 
        const updateInventory = await Inventory.findByIdAndUpdate(
            id,
                {
                    productId: inventoryExist.productId,
                    ...req.body,
                    status: "active",
                    lastUpdated: Date.now(),
                },
                {
                    new: true,
                    runValidators: true,
                }
            )
                .lean()
                .exec();

        
        await Product.findByIdAndUpdate(
            inventoryExist.productId,
            {
              activeAt: 'active',
            },
            {
              new: true,
              runValidators: true,
            }
          )

          return updateInventory;
    } 
    else{
        const updateInventory = await Inventory.findByIdAndUpdate(
            id,
        {
            ...req.body,
            productId: inventoryExist.productId,
            status: "active",
            lastUpdated: Date.now(),
        },
        {
            new: true,
            runValidators: true,
        }
       
    )
        .lean()
        .exec();

        console.log(updateInventory, "Update Inventory")
    return updateInventory;
    }

}

//Delete ...
exports.DeleteInventoryInfo = async (id) => {

    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ErrorHandler(`Invalid Inventory ID: ${id}`);

    const inventoryExist = await Inventory.findOne({ _id: id });
    if (!inventoryExist) throw new ErrorHandler(`Inventory not exist with ID: ${id}`);

    await Promise.all([
        Inventory.deleteOne({ _id: id }).lean().exec(),
        Product.updateMany({ $pull: { stock: id } }).lean().exec(),
        Order.updateMany({ $pull: { "OrderItems.inventoryProduct": id } }).lean().exec(),
      ]);
    return inventoryExist;
}

exports.ActiveInventoryInfo = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ErrorHandler(`Invalid Inventory ID: ${id}`);

    const inventory = await Inventory.findByIdAndUpdate
        (id,
            {
                activeAt: 'active',
            },
            {
                new: true,
                runValidators: true,
            }
        )
        .lean()
        .exec();

    return inventory;
}

exports.InActiveInventoryInfo = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ErrorHandler(`Invalid Inventory ID: ${id}`);

    const inventory = await Inventory.findByIdAndUpdate
        (id,
            {
                activeAt: 'inactive',
            },
            {
                new: true,
                runValidators: true,
            }
        )
        .lean()
        .exec();

    return inventory;
}

exports.InventoryProduct = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ErrorHandler(`Invalid Inventory ID: ${id}`);

    const inventory = await Inventory.find({ productId: id })
        .populate({ path: "productId", select: "productName" })

    return inventory;

}

exports.InventoryCheckStock = async (req) => {
    try {
        const orderItems = req.body.orderItems;
        const lowStockItems = [];
        const updatedOrderItems = [];

        for (const item of orderItems) {
            const inventory = await Inventory.findById(item.inventoryId)
                .populate({ path: "productId", select: "productName" })
                .lean()
                .exec();
            console.log(inventory, "Inventory");
            if (!inventory) {
                return res.status(404).json({
                    success: false,
                    message: `Inventory not found for ID: ${item.inventoryId}`,
                });
            }

            if (inventory.quantity === 0) {
                lowStockItems.push({
                    productName: inventory.productId.productName,
                    inventoryId: item.inventoryId,
                    unitName: inventory.unitName,
                    metricUnit: inventory.metricUnit,
                    reason: "out_of_stock",
                    message: `Out of stock for ${inventory.productId.productName} ${inventory.unitName} ${inventory.metricUnit}`,
                });
            } else if (inventory.quantity < item.quantity) {
                lowStockItems.push({
                    productName: inventory.productId.productName,
                    inventoryId: item.inventoryId,
                    unitName: inventory.unitName,
                    metricUnit: inventory.metricUnit,
                    currentStock: inventory.quantity,
                    reason: "low_stock",
                    message: `Requested quantity (${item.quantity}) exceeds stock (${inventory.quantity}) for ${inventory.productId.productName} ${inventory.unitName} ${inventory.metricUnit}. Quantity adjusted to ${inventory.quantity}.`,
                });
                updatedOrderItems.push({
                    ...item,
                    quantity: inventory.quantity,
                });
            } else {
                updatedOrderItems.push(item);
            }
        }

        if (lowStockItems.length > 0) {
            return ({
                success: false,
                message: "Some items have low or no stock.",
                lowStockItems,
                updatedOrderItems,
            });
        }

        return ({
            success: true,
            message: "All items are in stock.",
            updatedOrderItems: orderItems,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, STATUSCODE.SERVER_ERROR));
    }
};

exports.InventoryDashboard = async (req) => {
    let startOfDay, endOfDay;
    const now = new Date(); 
    let currentDayString = '';

    if (req.body.type === "daily") {
        startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

    const options = { month: 'short', day: 'numeric' };
    const formattedDate = startOfDay.toLocaleDateString('en-US', options);
    currentDayString = `${formattedDate}, ${startOfDay.getFullYear()}`; 

    } else if (req.body.type === "weekly") {

    const dayOfWeek = now.getDay(); 
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; 
    const diffToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek; 

    startOfDay = new Date(now);
    startOfDay.setDate(now.getDate() + diffToMonday);
    startOfDay.setHours(0, 0, 0, 0);

    endOfDay = new Date(now);
    endOfDay.setDate(now.getDate() + diffToSunday);
    endOfDay.setHours(23, 59, 59, 999);

    const start = new Date(startOfDay);
    const end = new Date(endOfDay);

    const options = { month: 'short', day: 'numeric' };
    const formattedStart = start.toLocaleDateString('en-US', options); 
    const formattedEnd = end.toLocaleDateString('en-US', options);    

    currentDayString = `${formattedStart} - ${formattedEnd}, ${start.getFullYear()}`;
    }
    else if (req.body.type === "monthly") {
        startOfDay = new Date(now.getFullYear(), now.getMonth(), 1);
        endOfDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const options = { month: 'short' };
        const formattedDate = startOfDay.toLocaleDateString('en-US', options);
        currentDayString = `${formattedDate} - ${startOfDay.getFullYear()}`; 
    } else if (req.body.type === "yearly") {
        startOfDay = new Date(now.getFullYear(), 0, 1);
        endOfDay = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

        const options = { year: 'numeric' };
        const formattedDate = startOfDay.toLocaleDateString('en-US', options);
        currentDayString = `${formattedDate}`;
    }

    const coopId = await Farm.findOne({ user: req.body.user }).lean().exec();
    if (!coopId) throw new ErrorHandler(`Coop not exist with ID: ${req.body.user}`);

  
    const inventoryDaily = await Inventory.aggregate([
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product"
          }
        },
        { $unwind: "$product" },
        {
          $match: {
            "product.coop": coopId._id,
            "product.activeAt": "active"
          }
        },
        {
          $lookup: {
            from: "deliveries",
            let: { inventoryId: "$_id" },
            pipeline: [
              {
                $match: {
                  status: "delivered",
                  createdAt: { $gte: startOfDay, $lt: endOfDay }
                }
              },
              { $unwind: "$orderItems" },
              {
                $match: {
                  $expr: {
                    $eq: ["$orderItems.inventoryProduct", "$$inventoryId"]
                  }
                }
              },
              {
                $group: {
                  _id: null,
                  totalDelivered: { $sum: "$orderItems.quantity" }
                }
              }
            ],
            as: "deliveryData"
          }
        },
        {
          $addFields: {
            quantityDelivered: {
              $ifNull: [{ $arrayElemAt: ["$deliveryData.totalDelivered", 0] }, 0]
            },
            currentDay: currentDayString
          }
        },
        {
          $group: {
            _id: {
              productName: "$product.productName",
            },
            variations: {
              $push: {
                unitName: "$unitName",
                metricUnit: "$metricUnit",
                currentStock: "$quantity",
                quantityDelivered: "$quantityDelivered"
              }
            },
            currentDay: { $first: "$currentDay" }
          }
        },
        {
          $project: {
            _id: 0,
            productName: "$_id.productName",
            variations: 1,
            currentDay: 1
          }
        },
        {
          $group: {
            _id: "$currentDay",
            products: {
              $push: {
                productName: "$productName",
                variations: "$variations"
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            currentDay: "$_id",
            products: 1
          }
        }
      ]);

    return inventoryDaily;
};
