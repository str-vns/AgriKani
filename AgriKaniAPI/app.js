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
const wallet = require("./routes/wallets");
const transaction = require("./routes/transaction")
const weather = require("./routes/weather");
const axios = require("axios");
const User = require("./models/user");
const { sendEmail } = require("./utils/sendMail");
const { sendFcmNotification } = require("./services/sendFcmNotif");

// app.use("/", (req, res)=> res.status(200).send("Welcome to Jcoop API"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const getPaymentStatus = async (paymentIntentId) => {
  try {
    const { data } = await axios.get(`https://api.paymongo.com/v1/payment_intents/${paymentIntentId}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_TEST_KEY).toString('base64')}`, 
      },
    });

    return data?.data?.attributes?.payments[0]?.attributes?.status || "failed"; 
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    return "failed"; // Return "failed" in case of an error
  }
};

app.get('/app-redirect', async (req, res) => {
  const paymentIntentId = req.query.payment_intent_id || "pi_HpHWKXpBRjchxLeqb3dnqfNT";
  const paymentStatus = await getPaymentStatus(paymentIntentId);
  console.log('Payment status:', paymentStatus);
  const appDeepLink = `myjuanapp://Review?payment_intent_id=${paymentIntentId}&status=${paymentStatus}`;
  const fallbackUrl = 'https://yourwebsite.com';

  res.send(`
    <html>
      <head>
        <title>Redirecting...</title>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: white;
            font-family: Arial, sans-serif;
          }
          .content {
            text-align: center;
          }
          button {
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
          }
          #fallback {
            margin-top: 20px;
          }
        </style>
        <script type="text/javascript">
          function openApp() {
            let now = new Date().getTime();
            console.log("Attempting to open the app with deep link:", "${appDeepLink}");

            // Try to open the app via the deep link
            window.location.href = "${appDeepLink}";

            // Fallback if the app doesn't open within 4 seconds
            setTimeout(function() {
              let elapsed = new Date().getTime() - now;
              if (elapsed < 4000) {
                console.log("The app did not open, redirecting to fallback URL.");
                window.location.replace("${fallbackUrl}");
              } else {
                console.log("App opened successfully.");
              }
            }, 4000);
          }

          window.onload = function() {
            openApp();  // Automatically trigger deep link when page loads
            let fallbackMessage = document.getElementById('fallback');
            setTimeout(() => {
              fallbackMessage.style.display = 'block';
              console.log("Displaying fallback message: If nothing happens, click here.");
            }, 2000);
          }
        </script>
      </head>
      <body>
        <div class="content">
          <p>Redirecting to app...</p>
          <button onclick="openApp()">Open App</button>
          <p id="fallback" style="display:none;">If nothing happens, <a href="${appDeepLink}">click here</a>.</p>
        </div>
      </body>
    </html>
  `);
});

app.post('/send-email', async (req, res) => {
  const email = req.body.email;

  if (!email) return res.status(400).json({ error: 'Email is required' });
    const mailOptions = {
      to: email,
      subject: `Test`,
      html: `
      <p>Dear Test,</p>
  <p>This is Test only.</p>
      `,
      };

  try {
      await sendEmail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
      res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
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
  senior,
  wallet,
  transaction, 
  weather,
);

module.exports = app;
