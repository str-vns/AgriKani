const mongoose = require("mongoose");
const validator = require("validator");
const { RESOURCE } = require("../constants/index");


const walletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: RESOURCE.USER,
        required: true,
        unique: true,
      },
      balance: {
        type: Number,
        default: 0, 
      },
      transactions: [
        {
          type: {
            type: String,
            enum: ["EARN", "WITHDRAW", "REFUND"],
            required: true,
          },
          amount: {
            type: Number,
            required: true,
          },
          date: {
            type: Date,
            default: Date.now,
          },
          referenceId: String, 
        },
      ],
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
});

module.exports = mongoose.model(RESOURCE.WALLET, walletSchema);
