const mongoose = require("mongoose");
const validator = require("validator");
const { RESOURCE } = require("../constants/index");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter the blog title!"],
    maxLength: [150, "The title cannot exceed 150 characters!"],
  },

  content: {
    type: String,
    required: [true, "Please provide the blog content!"],
  },

  link: {
    type: String,
    validate: {
      validator: function (value) {
        return validator.isURL(value); // Ensures the input is a valid URL
      },
      message: "Please enter a valid URL!",
    },
    default: null, // Optional field
  },

  publishedAt: {
    type: Date,
    default: Date.now,
  },

  deletedAt: {
    type: Date,
    default: Date.now,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(RESOURCE.BLOG, blogSchema);
