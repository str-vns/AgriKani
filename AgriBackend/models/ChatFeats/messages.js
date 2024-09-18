const mongoose = require("mongoose");
const { RESOURCE } = require("../../constants/index");

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
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
    key: {
      type: String,
    },
    iv: {
      type: String,
    },
    tag: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(RESOURCE.MESSAGES, MessageSchema);