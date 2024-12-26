const DeliveryProcess = require("../process/deliveryProcess");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE } = require("../constants/index");
const asyncHandler = require("express-async-handler");
const CheckField = require("../helpers/FieldMonitor");

exports.createDelivery = [
    CheckField(["assignedTo", "coopId", "orderId"]),
    asyncHandler(async (req, res) => {
        const delivery = await DeliveryProcess.createDeliveryProcess(req);
        return SuccessHandler(
        res,
        `Delivery: ${delivery?.orderId} has been created successfully`,
        delivery
        );
    }),
];

exports.getDeliveryTracking = asyncHandler(async (req, res, next) => {
    const delivery = await DeliveryProcess.getDeliveryTrackingProcess(req.params.id);
    return delivery?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Delivery Found"))
    : SuccessHandler(res, `All Deliveries has been fetched Successfully`, delivery);
});

exports.getDeliveryDriver = asyncHandler(async (req, res, next) => {
    const delivery = await DeliveryProcess.getDeliveryDriverProcess(req.params.id);
    return delivery
    ? SuccessHandler(res, `Delivery has been fetched Successfully`, delivery)
    : next(new ErrorHandler("No Delivery Found"));
});

exports.UpdateDeliveryStatus = asyncHandler(async (req, res, next) => {
    const delivery = await DeliveryProcess.UpdateDeliveryStatusProcess(req.params.id, req);
    return delivery
    ? SuccessHandler(res, `Delivery has been updated Successfully`, delivery)
    : next(new ErrorHandler("No Delivery Found"));
} );

exports.qrCodeDelivered = asyncHandler(async (req, res, next) => {
    const delivery = await DeliveryProcess.qrCodeDeliveredProcess(req.params.id, req);
    return delivery
    ? SuccessHandler(res, `Delivery has been updated Successfully`, delivery)
    : next(new ErrorHandler("No Delivery Found"));
});