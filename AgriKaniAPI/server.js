require("dotenv").config({ path: "./config/.env" });
const app = require("./app");  // Your Express app
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { logger, logEvents } = require("./middleware/logger");
const { STATUSCODE } = require("./constants/index");
const { server } = require("./socketIO");  // Socket.IO server

const PORT = process.env.PORT || 4000;  // Use 4000 for both HTTP and Socket.IO server

connectDB();
app.use(logger);

mongoose.connection.once("open", () => {
  // Start the server on the same port
  server.listen(PORT, () => {
    console.log(`Server is running on ${mongoose.connection.host}:${PORT}`);
    logEvents(
      `Server is running on ${mongoose.connection.host}:${PORT}`,
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