const Notification = require('../models/notification');
const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const { sendFcmNotification } = require("../services/sendFcmNotif");

exports.CreateNotification = async (req) => {

  if (!mongoose.Types.ObjectId.isValid(req.body.user === "admin" ? process.env.ADMIN_ID : req.body.user))
    throw new ErrorHandler(`Invalid User ID: ${req.body.user}`);

  const singleUser = await User.findById(req.body.user === "admin" ? process.env.ADMIN_ID : req.body.user).lean().exec();
  
  if (!singleUser) {
    throw new ErrorHandler(STATUSCODE.NOT_FOUND, "User not found");
  }

  if (!singleUser.deviceToken || singleUser.deviceToken.length === 0) {
    console.log("No device tokens found for the user.");
    return;
  }

  console.log("User found:", req.body.user);
  // Send FCM notification
  await sendFcmNotification(
    singleUser,
    req.body.title,
    req.body.content,
    req.body.type,
    req.body.url,
    req.body.fcmToken
  );

    const notification = await Notification.create({
      ...req.body,
      user: req.body.user === "admin" ? process.env.ADMIN_ID : req.body.user,
    });
  
    return notification;
};
//Read ...
exports.GetAllNotificationInfo = async () => {
  const notification = await Notification.find()
    .populate({ path: "user", select: "firstName lastName email image.url phoneNum" })
    .sort({ createdAt: STATUSCODE.NEGATIVE_ONE })
    .lean()
    .exec();
  return notification;
};

//Single ...
exports.GetSingleNotification = async (id) => {
  const notification = await Notification.find({ user: id })
    .populate({ path: "user", select: "firstName lastName email image.url phoneNum" })
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  if (!notification) {
    throw new ErrorHandler(STATUSCODE.NOT_FOUND, "Notification not found");
  }

  return notification;
};

exports.readNotification = async (req) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    {
      readAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return notification;
}

exports.readAllNotification = async (req) => { 
  const notification = await Notification.updateMany(
    { user: req.params.id },
    {
      readAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return notification;
}