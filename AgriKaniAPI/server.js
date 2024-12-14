require("dotenv").config({ path: "./config/.env" });
const app = require("./app")
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 4000 ;
const { logger, logEvents } = require("./middleware/logger");
const { STATUSCODE } = require("./constants/index");
const { analyzeMixedLanguage } = require("./utils/mixLanguage")
const { server } = require("./sokIo");

connectDB();
app.use(logger);

mongoose.connection.once("open", () => {

  server.listen(PORT, () => {
    console.log(`Server is running and connected to MongoDB on ${mongoose.connection.host}:${PORT}`);
    logEvents(
      `Server is running and connected to MongoDB on ${mongoose.connection.host}:${PORT}`,
      "mongoLog.log"
    );
  });
});

mongoose.connection.on("error", (err) => {
  console.log(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoLog.log"
  );
});


