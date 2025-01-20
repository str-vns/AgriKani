const mongoose = require("mongoose");
const validator = require("validator");
const { RESOURCE } = require("../constants/index");
const { ref } = require("pdfkit");


const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Please enter the product name!"],
    maxLength: [30, "Product name cannot exceed 30 characters!"],
  },
  description: {
    type: String,
    required: [true, "Please enter the product description!"],
  },
  stock:[
    {
       type: mongoose.Schema.ObjectId,
       ref: RESOURCE.INVENTORYM,
    }
  ],
  category: [{
    type: String,
    ref: RESOURCE.CATEGORYS,
  }],
  type: [{
    type: String,
    ref: RESOURCE.TYPE,
  }],
  image: [{
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
  }],
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
      order: {
        type: mongoose.Schema.ObjectId,
        ref: "order",
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
  coop: {
    type: mongoose.Schema.ObjectId,
    ref: RESOURCE.FARMINFO,
    required: true,
  },
  activeAt:{
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  apporivedAt:{
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date, 
    default: null,
  },
});

module.exports = mongoose.model(RESOURCE.PRODUCT, productSchema);
