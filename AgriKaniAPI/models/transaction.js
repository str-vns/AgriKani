const mongoose = require("mongoose");
const validator = require("validator");
const { RESOURCE } = require("../constants/index");

const transactionSchema = new mongoose.Schema(
    {
     user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: RESOURCE.USER,
            required: true,
      },
      type: {
        type: String,
        enum: ["WITHDRAW", "REFUND"],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      transactionStatus: {
        type: String,
        enum: ["PENDING", "SUCCESS", "FAILED"],
        default: "PENDING",
      },
      paymentMethod: {
        type: String,
        enum: ["paymaya", "gcash"],
        required: true,
      }, 
      accountName:{
        type: String,
        required: true,
      },
     accountNumber:{
        type: Number,
        required: true,
     },
      date: {
        type: Date,
        default: Date.now,
      },
      cancelledId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: RESOURCE.CANCELLED,
      }
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(RESOURCE.TRANSACTION, transactionSchema);
