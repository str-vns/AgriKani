const mongoose = require("mongoose");
const validator = require("validator");
const { RESOURCE } = require("../constants/index");

const farmSchema = new mongoose.Schema({
  farmName: {
    type: String,
    required: [true, "Please enter your Farm!"],
    maxLength: [100, "Your name cannot exceed 100 characters!"],
  },
  address: {
    type: String,
    required: [true, "Please enter the Address!"],
  },
  barangay:
  {
    type: String,
    required: [true, "Please enter the Barangay!"],
  },
  city: {
    type: String,
    required: [true, "Please enter the City!"],
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
  sentiment: {
    type: String,
    default: "neutral",
  },
  sentimentOverall: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      sentimentScore:{
        type: Number,
        default: 0,
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
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ], 
  requirements: {
    businessPermit: {
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
    tinNumber: {
      type: String,
      required: true,
    }, 
    corCDA:{
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
    orgStructure: {
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
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  approvedAt: {
    type: Date,
    default: null,
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
