require("dotenv").config({ path: "./config/.env" });
const app = require("./app");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const nodeCron = require("node-cron");
const PORT = process.env.PORT || 4000;
const { logger, logEvents } = require("./middleware/logger");
const { server } = require("./sokIo");
const WeatherService = require("./services/weatherService");

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
