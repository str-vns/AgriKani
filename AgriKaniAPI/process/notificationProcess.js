const Notification = require('../models/notification');
const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const admin = require('firebase-admin');
const serviceAccount = require('../notifacation-ko-firebase-adminsdk-sahjo-8e50ce651d.json');

// NOTE Three DOTS MEANS OK IN COMMENT
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.TYPE,
    projectId: process.env.PROJECT_ID,
    privateKeyId: process.env.PRIVATE_KEY_ID,
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.CLIENT_EMAIL,
    clientId: process.env.CLIENT_ID,
    authUri: process.env.AUTH_URI,
    tokenUri: process.env.TOKEN_URI,
    authProviderX509CertUrl: process.env.AUTH_PROVIDER_X509_CERT_URL,
    clientX509CertUrl: process.env.CLIENT_X509_CERT_URL,
    universeDomain: process.env.UNIVERSE_DOMAIN  
  })
})

//create ...
exports.CreateNotification = async (req) => {
  console.log("Received File:", req.body.fcmToken);
  if (!mongoose.Types.ObjectId.isValid(req.body.user))
    throw new ErrorHandler(`Invalid User ID: ${req.body.user}`);

  const singleUser = await User.findById(req.body.user).lean().exec();
  
  if (!singleUser) {
    throw new ErrorHandler(STATUSCODE.NOT_FOUND, "User not found");
  }
  
  const filterToken = singleUser.deviceToken.filter((token) => token !== req.body.fcmToken);
  console.log("User Device Token:", filterToken);
  const registrationTokens = filterToken;
  const message = {
    data: {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    },
    notification: {
      title: req.body.title,
      body: req.body.content,
      imageUrl: req.body.url,
    },

    apns: {
      payload: {
        aps: {
          badges: 42,
        },
      },
    },
    tokens: registrationTokens 
  };
  
  admin.messaging().sendEachForMulticast(message)
  .then((response) => {
    console.log('Notification sent:', response);
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.log('Error sending to token:', response.responses[idx].error);
          failedTokens.push(tokens[idx]);
        }
      });
      console.log('Failed tokens:', failedTokens);
    }
  })
  .catch((error) => {
    console.error('Error sending notification:', error);
  });

  const notification = await Notification.create({
    ...req.body,
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