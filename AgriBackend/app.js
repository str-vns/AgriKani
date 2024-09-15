require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corOptions");
const cookieParser = require("cookie-parser");

// Routes
const users = require("./routes/user")
const auth = require("./routes/auth")
const products = require("./routes/product")

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v2", users, auth, products);

module.exports = app