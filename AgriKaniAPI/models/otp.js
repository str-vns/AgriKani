const mongoose = require("mongoose");
const { RESOURCE } = require("../constants");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 7,
  },
});

module.exports = mongoose.model(RESOURCE.OTP, otpSchema);
