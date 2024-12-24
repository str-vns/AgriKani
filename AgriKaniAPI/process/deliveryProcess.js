const User = require("../models/user");
const Driver = require("../models/driver");
const Delivery = require("../models/delivery");
const Otp = require("../models/otp");
const bcrypt = require("bcrypt");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE, GENDER } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const { uploadImageSingle } = require("../utils/imageCloud");
const { cloudinary } = require("../utils/cloudinary");

exports.createDeliveryProcess = async (req) => {
  
}

exports.getDeliveryProcess = async () => {
  
}

