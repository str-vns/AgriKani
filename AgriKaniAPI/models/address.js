const mongoose = require("mongoose");
const validator = require("validator");
const { RESOURCE } = require("../constants/index");

const addressSchema = new mongoose.Schema({
  address: {
    type: String,
    required: [true, "Please enter the Address!"],
  },
  city: {
    type: String,
    required: [true, "Please enter the City!"],
  },
  barangay:
  {
    type: String,
    required: [true, "Please enter the Barangay!"],
  },
  postalCode: {
    type: String,
    required: [true, "Please enter the Postal Code!"],
  },
  latitude: {
    type: String,
    required: [true, "Please enter the Latitude!"],
  },
  longitude: {
    type: String,
    required: [true, "Please enter the Longitude!"],
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  defaultIt:{
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model(RESOURCE.ADDRESS, addressSchema);
