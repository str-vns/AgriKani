const mongoose = require("mongoose");
const { RESOURCE } = require("../constants/index");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  orderItems: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"],
      },
      price: {
        type: Number,
        required: true,
      },
      orderConfirmation: {
        type: Date,
        default: Date.now,
      },
      orderStatus: {
        type: String,
        enum: ["Pending", "Shipping", "Delivered", "Cancelled", "Processing"],
        default: "Pending",
      },
      coopUser: {
        type: mongoose.Schema.ObjectId,
        ref: RESOURCE.FARMINFO,
        required: true,
      },
      inventoryProduct: {
        type: mongoose.Schema.ObjectId,
        ref: RESOURCE.INVENTORYM,
        required: true,
      },
      deliveryId: {
        type: mongoose.Schema.ObjectId,
        ref: RESOURCE.DELIVERY,
        required: false,
      },
    },
  ],
  shippingAddress: {
    type: mongoose.Schema.ObjectId,
    ref: "address",
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["COD", "Credit Card", "PayPal"],
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(RESOURCE.ORDER, orderSchema);
