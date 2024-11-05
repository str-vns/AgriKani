const mongoose = require("mongoose");
const validator = require("validator");
const { RESOURCE } = require("../constants/index");

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, "Please enter your Category!"],
    maxLength: [100, "Your name cannot exceed 100 characters!"],
  },
  image: 
    {
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
  deletedAt: {
    type: Date,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(RESOURCE.CATEGORY, categorySchema);
