const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const Inventory = require("../models/inventoryM");
const Product = require("../models/product");
const Farm = require("../models/farm");
const product = require("../models/product");
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
        
        console.log(inventories, "Inventories related to the products");
    
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

    const updateInventory = await Inventory.findByIdAndUpdate(
        id,
        {
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

    return updateInventory;
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