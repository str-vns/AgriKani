require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corOptions");
const cookieParser = require("cookie-parser");

// Routes
const users = require("./routes/user");
const auth = require("./routes/auth");
const products = require("./routes/product");
const conversation = require("./routes/Chat/conversation");
const messages = require("./routes/Chat/message");
const address = require("./routes/address");
const farms = require("./routes/farm");
const comment = require("./routes/comment");
const post = require("./routes/post");
const shared = require("./routes/sharedpost")
const otp = require("./routes/otp");
const order = require("./routes/order");
const type = require("./routes/type");
const category = require("./routes/category");
const blog = require ("./routes/blog");

// app.use("/", (req, res)=> res.status(200).send("Welcome to Jcoop API"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(
  "/api/v2",
  users,
  auth,
  products,
  conversation,
  messages,
  address,
  farms,
  comment,
  post,
  shared,
  otp,
  order,
  category,
  type,
  blog,

);

module.exports = app;
