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
const notification = require("./routes/notification");
const inventory = require("./routes/inventory");
const member = require("./routes/member");
const driver = require("./routes/driver");
const delivery = require("./routes/delivery")
const cancelled = require("./routes/cancelled");
const pwd = require("./routes/Discount/pwd");
const senior = require("./routes/Discount/senior");
const axios = require("axios");

// app.use("/", (req, res)=> res.status(200).send("Welcome to Jcoop API"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/payment-redirect", (req, res) => {
  const paymentIntentId = req.query.payment_intent_id;
  const appDeepLink = `juanCoop://payment-success?payment_intent_id=${paymentIntentId}`;
  const fallbackUrl = `https://your-website.com/payment-success?payment_intent_id=${paymentIntentId}`;

  res.send(`
    <html>
      <head>
        <meta http-equiv="refresh" content="0;url=${appDeepLink}" />
        <script>
          setTimeout(() => {
            window.location.href = "${fallbackUrl}";
          }, 3000);
        </script>
      </head>
      <body>
        <p>Redirecting to app... If nothing happens, <a href="${appDeepLink}">click here</a>.</p>
      </body>
    </html>
  `);
});

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
  notification,
  inventory,
  member,
  driver,
  delivery,
  cancelled,
  pwd,
  senior
);

module.exports = app;
