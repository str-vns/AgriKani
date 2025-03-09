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
