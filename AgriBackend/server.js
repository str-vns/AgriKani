require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corOptions");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { logger, logEvents } = require("./middleware/logger");
const { STATUSCODE } = require("./constants/index");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 4000;

// Routes
const users = require("./routes/user")

connectDB();
app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


app.use("/api/v2", users);

mongoose.connection.once("open", () => {
  app.listen(PORT);
  console.log(`Server is running to MongoDB on ${mongoose.connection.host}:${PORT}`);
  logEvents(
    `Server is running to MongoDB on ${mongoose.connection.host}:${PORT}`,
    "mongoLog.log"
  );
});

mongoose.connection.on("error", (err) => {
  console.log(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoLog.log"
  );
});