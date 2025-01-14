const CheckField = require("../helpers/FieldMonitor");
const asyncHandler = require("express-async-handler");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE } = require("../constants/index");
const inventoryProcess = require('../process/inventoryProcess');

exports.CreateInventory = [
    CheckField(["productId", "quantity", "price", "metricUnit", "unitName"]),
    asyncHandler(async (req, res) => {
        const inventory = await inventoryProcess.CreateInventoryProcess(req);
    
        return SuccessHandler(
        res,
        `Inventory: ${inventory?.productName} has been created successfully`,
        inventory
        );
    }),
];

exports.GetAllInventory = asyncHandler(async (req, res, next) => {
    const inventory = await inventoryProcess.GetAllInventoryInfo();

    return inventory?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Inventory Found"))
    : SuccessHandler(
        res,
        `All Inventory has been fetched Successfully`,
        inventory
    );
});

exports.GetSingleInventory = asyncHandler(async (req, res, next) => {
    const inventory = await inventoryProcess.GetSingleInventory(req.params.id);

    return inventory?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Inventory Found"))
    : SuccessHandler(
        res,
        `Inventory has been fetched Successfully`,
        inventory
    );
});

exports.UpdateInventory = [
    CheckField(["quantity", "price", "metricUnit", "unitName"]),
    asyncHandler(async (req, res) => {
        const inventory = await inventoryProcess.UpdateInventoryInfo(req, req.params.id);
        return SuccessHandler(
        res,
        `Inventory Name ${inventory?.productName} has been Update Successfully`,
        inventory
        );
    }),
];

exports.DeleteInventory = asyncHandler(async (req, res, next) => {
    console.log(req.params.id);
    const inventory = await inventoryProcess.DeleteInventoryInfo(req.params.id);

    return inventory?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Inventory Found"))
    : SuccessHandler(res, inventory);
});

exports.ActiveInventory = asyncHandler(async (req, res) => {
    const inventory = await inventoryProcess.ActiveInventoryInfo(req.params.id);

    return SuccessHandler(
    res,
    `Inventory ${inventory.productName} has been put in Archive Successfully`,
    inventory
    );
});

exports.InActiveInventory = asyncHandler(async (req, res) => {
    const inventory = await inventoryProcess.InActiveInventoryInfo(req.params.id);

    return SuccessHandler(
    res,
    `The Inventory ${inventory.productName} has been Restore Successfully`,
    inventory
    );
});

exports.getInventoryProduct = asyncHandler(async (req, res) => {

    const inventory = await inventoryProcess.InventoryProduct(req.params.id);
    return SuccessHandler(
    res,
    `The Inventory ${inventory.productName} has been Restore Successfully`,
    inventory
    );
});
