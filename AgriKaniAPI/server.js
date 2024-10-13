require("dotenv").config({ path: "./config/.env" });
const app = require("./app")
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 4000;
const { logger, logEvents } = require("./middleware/logger");
const { STATUSCODE } = require("./constants/index");
const { analyzeMixedLanguage } = require("./utils/mixLanguage")
connectDB();
app.use(logger);

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



// var result = analyzeMixedLanguage('tanga ka, BOBO PA, pero Mabait ka But its fine' )
// console.log(result)