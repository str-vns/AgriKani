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

console.log('admin', admin.credential);
exports.sendFcmNotification = async (user, title, content, type, url, fcmToken) => {
  console.log('user', user);
  if (!user?.deviceToken || user?.deviceToken.length === 0) {
    console.log("No device tokens found for the user.");
    return;
  }

  let registrationTokens = user?.deviceToken;
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
    data:  {
      title: title,
      body: content,
      imageUrl: url,
      type: type || "default",
    },
    notification: {
      title: title,
      body: content,
      imageUrl: url,
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
    console.log("Sending notification to the user:", user?.email);
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log("Notification sent:", response);

    // if (response.failureCount > 0) {
    //   const failedTokens = [];
    //   response.responses.forEach((resp, idx) => {
    //     if (!resp.success) {
    //       console.log("Error sending to token:", response.responses[idx].error);
    //       failedTokens.push(user.deviceToken[idx]);
    //     }
    //   });
    //   console.log("Failed tokens:", failedTokens);
    // }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

