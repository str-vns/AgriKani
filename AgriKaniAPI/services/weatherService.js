const axios = require("axios");
const User = require("../models/user");
const admin = require("firebase-admin");
const { STATUSCODE } = require("../constants/index");

exports.checkWeatherNotification = async () => {
  try {
    const response = await axios.get(
      `https://api.weatherbit.io/v2.0/current?city=Bulacan&country=PH&key=${process.env.API_WEATHER_KEY}`
    );
    const weatherData = response.data.data[0].precip;
    // const weatherData = 3;

    let notification = null;
    if (weatherData >= 2.6 && weatherData <= 7.5) {
      notification = {
        title: `Weather Warning ⚠️`,
        content: `Due to moderate rain, there is a possibility of delivery delays.`,
        type: "weather",
      };
    } else if (weatherData >= 7.6 && weatherData <= 10) {
      notification = {
        title: `Weather Warning ⚠️`,
        content: `Due to heavy rain, delivery is postponed. It will resume once the weather clears. Stay safe, everyone!`,
        type: "weather",
      };
    } else if (weatherData >= 10.1) {
      notification = {
        title: `Weather Warning ⚠️`,
        content: `Due to severe rain, delivery is postponed. It will resume once the weather clears. Stay safe, everyone!`,
        type: "weather",
      };
    }
    if (!notification) return;

    const users = await User.find()
      .sort({ createdAt: STATUSCODE.NEGATIVE_ONE })
      .lean()
      .exec();
    const registrationTokens = [
      ...new Set(
        users
          .map((user) => user.deviceToken)
          .filter((token) => token)
          .flat()
      ),
    ];

    if (registrationTokens.length === 0) {
      console.log("No device tokens found.");
      return;
    }

    const message = {
      data: {
        key1: "value1",
        key2: "value2",
      },
      notification: {
        title: notification.title,
        body: notification.content,
      },
      android: {
        priority: "high",
      },
      apns: {
        payload: {
          aps: {
            badge: 42,
          },
        },
      },
      tokens: registrationTokens,
    };

    admin
      .messaging()
      .sendEachForMulticast(message)
      .then((response) => {
        console.log("Notification sent:", response);
        if (response.failureCount > 0) {
          const failedTokens = response.responses
            .map((resp, idx) =>
              !resp.success ? registrationTokens[idx] : null
            )
            .filter(Boolean);
          console.log("Failed tokens:", failedTokens);
        }
      })
      .catch((error) => {
        console.error("Error sending notification:", error);
      });
  } catch (error) {
    console.error("Error in checkWeatherNotification:", error);
  }
};

exports.dailyWeather = async () => {
  const response = await axios.get(
    `https://api.weatherbit.io/v2.0/forecast/daily?city=Bulacan&country=PH&key=${process.env.API_WEATHER_KEY}`
  );

  if (!response) {
    console.log("No data found");
    return null;
  } else {
    return response.data;
  }
};

exports.currentWeather = async () => {
  const response = await axios.get(
    `https://api.weatherbit.io/v2.0/current?city=Bulacan&country=PH&key=${process.env.API_WEATHER_KEY}`
  );

  if (!response) {
    console.log("No data found");
    return null;
  }

  return response.data;
};
