const mongoose = require("mongoose");
const validator = require("validator");
const { RESOURCE } = require("../constants/index");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Please enter the product name!"],
    maxLength: [30, "Product name cannot exceed 30 characters!"],
  },
  description: {
    type: String,
    required: [true, "Please enter the product description!"],
  },
  pricing: {
    type: Number,
    required: [true, "Please enter the product price!"],
    min: [1, "Price must be at least 1 or higher"],
  },
  stock: {
    type: Number,
    min: [1, "Stock must be at least 1"],
    max: [200, "Stock cannot exceed 200"],
    required: [true, "Please enter the stock quantity!"],
  },
  category: [{
    type: String,
  }],
  image: [{
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
  }],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
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

module.exports = mongoose.model(RESOURCE.PRODUCT, productSchema);
