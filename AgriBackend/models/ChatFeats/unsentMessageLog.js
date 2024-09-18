const mongoose = require("mongoose");
const { RESOURCE } = require("../../constants/index");

const unsentMessageSchema = new mongoose.Schema(
  {
    originalMessageId: {
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
    },
    unsentAt:
    {
        type: Date,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(RESOURCE.UNSENT_MESSAGES, unsentMessageSchema);