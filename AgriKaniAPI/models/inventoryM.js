const mongoose = require("mongoose");
const validator = require("validator");
const { RESOURCE } = require("../constants/index");

const inventoryMSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: RESOURCE.PRODUCT,
    required: true,
  },
  quantity: {
      type: Number,
      max: [100, "Stock cannot exceed 100"],
      required: [true, "Please enter the stock quantity!"],
      validate: {
        validator: Number.isFinite,
        message: "Price must be a number",
      }
  },
  metricUnit: {
    type: String,
    enum: ["kg", "g", "lb", "oz", "liter", "ml", "pcs","l"],
    required: [true, "Please enter the metric unit!"],
  },
  unitName: {
    type: String,
    required: [true, "Please enter the unit name!"], 
    trim: true
  },
  price:{
    type: Number,
    required: [true, "Please enter the price!"],
    min: [1, "Price must be at least 1 or higher"],
    validate: {
      validator: Number.isFinite,
      message: "Price must be a number",
    }
  },
  lowStockThreshold: {
    type: Number,
    default: 5,
    min: [1, "Threshold must be at least 1"],
  },
  status:{
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(RESOURCE.INVENTORYM, inventoryMSchema);