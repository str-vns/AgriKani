const admin = require('firebase-admin');

exports.sendFcmNotification = async (user, title, content, fcmToken) => {
  console.log('user', user);
  if (!user.deviceToken || user.deviceToken.length === 0) {
    console.log("No device tokens found for the user.");
    return;
  }

  
  console.log("Device tokens found for the user:", user);
  let registrationTokens = user.deviceToken;
  if (fcmToken) {
    registrationTokens = registrationTokens.filter(
      (token) => token !== fcmToken
    );
  }

  if (registrationTokens.length === 0) {
    console.log("No valid tokens available for sending notifications.");
    return;
  }

  const message = {
    data: {
      key1: "value1",
      key2: "value2",
      key3: "value3",
    },
    notification: {
      title,
      body: content,
    },
    apns: {
      payload: {
        aps: {
          badges: 42,
        },
      },
    },
    tokens: registrationTokens,
  };

  try {
    console.log("Sending notification to the user:", user.email);
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log("Notification sent:", response);

    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.log("Error sending to token:", response.responses[idx].error);
          failedTokens.push(user.deviceToken[idx]);
        }
      });
      console.log("Failed tokens:", failedTokens);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

