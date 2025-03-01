const mongoose = require("mongoose");
const { RESOURCE } = require("../../constants/index");

const seniorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter the First name!"],
    maxLength: [30, "Product name cannot exceed 30 characters!"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter the Last name!"],
    maxLength: [30, "Product name cannot exceed 30 characters!"],
  },
  frontImage: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    originalname: {
      type: String,
      required: true,
    },
  },
  backImage: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      originalname: {
        type: String,
        required: true,
      },
  },
  birthDate: {
    type: Date,
    required: [true, "Please enter the BirthDay name!"],
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: RESOURCE.USER,
    required: true,
  },
  approvedAt:{
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date, 
    default: null,
  },
});

module.exports = mongoose.model(RESOURCE.SENIOR, seniorSchema);
