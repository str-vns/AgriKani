const mongoose = require("mongoose");
const validator = require("validator");
const { RESOURCE } = require("../constants/index");

const typeSchema = new mongoose.Schema({
  typeName: {
    type: String,
    required: [true, "Please enter your Type!"],
    maxLength: [100, "Your name cannot exceed 100 characters!"],
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

module.exports = mongoose.model(RESOURCE.TYPE, typeSchema);
