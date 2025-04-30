require("dotenv").config({ path: "./config/.env" });
const app = require("./app");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const nodeCron = require("node-cron");
const PORT = process.env.PORT || 4000;
const { logger, logEvents } = require("./middleware/logger");
const { server } = require("./sokIo");
const WeatherService = require("./services/weatherService");
const DeliveryFailed = require("./services/deliveriesFailedService");
const deliveryAuto = require("./process/deliveryProcess");

connectDB();
app.use(logger);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");

  nodeCron.schedule("0 7 * * *", async () => {
    try {
      console.log("Checking weather notifications...");
      await WeatherService.checkWeatherNotification();
    } catch (error) {
      console.error("Error in WeatherService:", error);
    }
  });

  // nodeCron.schedule("*/10 * * * *", async () => {
  //   try {
  //     console.log("Checking weather notifications...");
  //     await WeatherService.checkWeatherNotification();
  //   } catch (error) {
  //     console.error("Error in WeatherService:", error);
  //   }
  // });

  const Timedata = [
    "0 8 * * *",   
    "0 10 * * *",   
    "0 12 * * *", 
    "0 15 * * *",  
  ];
  
  Timedata.forEach((cronTime) => {
    nodeCron.schedule(cronTime, async () => {
      try {
        console.log("Automatically Assign Deliveries to Drivers...");
        await deliveryAuto.createDeliveryProcess();
        console.log("Assign delivery complete");
      } catch (error) {
        console.error("Error in Delivery Assignment:", error);
      }
    });
  });

  nodeCron.schedule("30 20 * * *", async () => {
    try {
      console.log("Checking failed deliveries...");
      await DeliveryFailed.failedAllDeliveries();
    } catch (error) {
      console.error("Error in DeliveryFailedService:", error);
    }
  });

  server.listen(PORT, () => {
    console.log(`Server is running and connected to MongoDB on ${mongoose.connection.host}:${PORT}`);
    logEvents(
      `Server is running and connected to MongoDB on ${mongoose.connection.host}:${PORT}`,
      "mongoLog.log"
    );
  });
});

mongoose.connection.on("error", (err) => {
  console.error(`Database connection error: ${err.message}`);
  logEvents(
    `Database connection error: ${err.message}`,
    "mongoLog.log"
  );
});
