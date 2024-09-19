const mongoose = require("mongoose");
const validator = require("validator");
const { RESOURCE } = require("../constants/index");

const addressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please enter the name!"],
    maxLength: [100, "Product name cannot exceed 100 characters!"],
  },
  phoneNum: {
    type: String,
    required: [true, "Please enter your Last Name!"],
    minlength: [11, "Phone Number must be 11 digits"],
    maxlength: [11, "Phone Number must be 11 digits"],
  },
  region: {
    type: String,
    required: [true, "Please enter the Region!"],
  },
  province: {
    type: String,
    required: [true, "Please enter the Province!"],
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
  address: {
    type: String,
    required: [true, "Please enter the Address!"],
  },
  postalCode: {
    type: String,
    required: [true, "Please enter the Postal Code!"],
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(RESOURCE.ADDRESS, addressSchema);
