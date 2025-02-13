const mongoose = require("mongoose");
const validator = require("validator");
const { RESOURCE } = require("../constants/index");

const cancelledSchema = new mongoose.Schema({
  CancelledId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please provide the order ID!"],
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: RESOURCE.USER,
    required: [true, "Please provide the user ID!"],
  },
  text: {
    type: String,
    required: [true, "Please enter the blog title!"],
    maxLength: [150, "The title cannot exceed 150 characters!"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(RESOURCE.CANCELLED, cancelledSchema);
