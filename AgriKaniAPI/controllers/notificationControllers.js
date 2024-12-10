const CheckField = require("../helpers/FieldMonitor");
const asyncHandler = require("express-async-handler");
const notificationProcess = require("../process/notificationProcess");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE } = require("../constants/index");

exports.createNotification = [
    // CheckField(["title", "content", "user", "senderId"]),
    asyncHandler(async (req, res) => {
        const notification = await notificationProcess.CreateNotification(req);
    
        return SuccessHandler(
        res,
        `Notification has been created successfully`,
        notification
        );
    }),
]

exports.getAllNotification = asyncHandler(async (res, next) => {
    const notification = await notificationProcess.GetAllNotificationInfo();

    return notification?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Notification Found"))
    : SuccessHandler(res, `All Notification has been fetched Successfully`, notification);
});

exports.getSingleNotification = asyncHandler(async (req, res, next) => {
    const notification = await notificationProcess.GetSingleNotification(req.params.id);

    return notification?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Notification Found"))
    : SuccessHandler(res, `Notification has been fetched Successfully`, notification);
});

exports.readNotification = asyncHandler(async (req, res) => {
    const notification = await notificationProcess.readNotification(req);

    return SuccessHandler(res, `Notification has been read Successfully`, notification);
});

exports.readAllNotification = asyncHandler(async (req, res) => {
    const notification = await notificationProcess.readAllNotification(req);

    return SuccessHandler(res, `All Notification has been read Successfully`, notification);
});