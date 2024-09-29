const mongoose = require("mongoose");
const { RESOURCE } = require("../../constants/index");

const conversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(RESOURCE.CONVERSATION, conversationSchema);
