
import admin from 'firebase-admin';
 
 export const sendFcmNotification = async (user, title, content) => {
    if (!user.deviceToken || user.deviceToken.length === 0 || !user ) return;

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
    tokens: user.deviceToken, 
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

module.exports = { sendFcmNotification };
