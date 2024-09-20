const mongoose = require("mongoose");
const validator = require("validator");
const { RESOURCE } = require("../constants/index");

const farmSchema = new mongoose.Schema({
  farmName: {
    type: String,
    required: [true, "Please enter your Farm!"],
    maxLength: [100, "Your name cannot exceed 100 characters!"],
  },
  region: {
    type: String,
    required: [true, "Please enter the Region!"],
  },
  province: {
    type: String,
    required: [true, "Please enter the Province!"],
  },
  city: {
    type: String,
    required: [true, "Please enter the City!"],
  },
  barangay:
  {
    type: String,
    required: [true, "Please enter the Barangay!"],
  },
  address: {
    type: String,
    required: [true, "Please enter the Address!"],
  },
  postalCode: {
    type: String,
    required: [true, "Please enter the Postal Code!"],
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
  location: {
    type: String,
    enum: ["Point"],
    default: "Point",
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
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
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },

      images: [
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
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
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

module.exports = mongoose.model(RESOURCE.FARMINFO, farmSchema);
