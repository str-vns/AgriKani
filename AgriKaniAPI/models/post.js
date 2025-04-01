const mongoose = require("mongoose");
const validator = require("validator");
const { RESOURCE } = require("../constants/index");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Emter title!"],
  },
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
      originalname: {
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
  numOfComments: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
      },
      comment: {
        type: String,
        required: [true, "Comment cannot be empty!"],
      },
      sentimentScore: {
        type: Number,
        default: 0,
      },
      sentimentLabel: {
        type: String,
        enum: ["positive", "negative", "neutral"],
        default: "neutral",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  totalSentimentScore: {
    type: Number,
    default: 0,
  },
  overallSentimentLabel: {
    type: String,
    // enum: ["positive", "negative", "neutral"],
    default: "neutral",
  },

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
  status: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model(RESOURCE.POST, postSchema);