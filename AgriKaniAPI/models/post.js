const mongoose = require("mongoose");
const validator = require("validator");
const { RESOURCE } = require("../constants/index");

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Please enter the content!"],
  },
  image: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  comment: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      avatar: {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
        originalname: {
          type: String,
          required: true,
        },
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },

      image: [
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
      ],
    },
  ],
  deletedAt: {
    type: Date,
    default: null,
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
      },
    },
  ],
  likeCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(RESOURCE.POST, postSchema);