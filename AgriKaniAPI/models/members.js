const mongoose = require("mongoose");
const validator = require("validator");
const { RESOURCE } = require("../constants/index");

const memberSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: RESOURCE.USER,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    barangay: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    barangayClearance: {
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
    validId: {
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
    coopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: RESOURCE.COOP,
        required: true,
    },
    approvedAt:
    {
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
})

module.exports = mongoose.model(RESOURCE.MEMBER, memberSchema);