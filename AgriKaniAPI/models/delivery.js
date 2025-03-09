const mongoose = require('mongoose');
const validator = require('validator');
const { RESOURCE } = require('../constants/index');

const deliverySchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.ObjectId,
        ref: RESOURCE.ORDER,
        required: true,
    },
   coopId: {
        type: mongoose.Schema.ObjectId,
        ref: RESOURCE.FARMINFO,
        required: true,
    },
    orderItems: [{  
        product: {
            type: mongoose.Schema.ObjectId,
            ref: RESOURCE.PRODUCT,
            required: true,
        }, 
        quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"],
          },
         inventoryProduct: {
                type: mongoose.Schema.ObjectId,
                ref: RESOURCE.INVENTORYM,
                required: true,
              },
    }],
    totalAmount: {
        type: Number,
        required: true,
        default: 0.0,
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: RESOURCE.USER,
        required: true,
    },
    shippingAddress: {
        type: mongoose.Schema.ObjectId,
        ref: RESOURCE.ADDRESS,
        required: true,
    },
    deliveryLocation: {
        Latitude: {
            type: String,
            required: true,
        },
        Longitude: {
            type: String,
            required: true,
        },
    },
    status: { 
        type: String, 
        enum: ["pending", "delivering", "cancelled", "re-deliver", "failed", "delivered"],
        default: "pending"
     },
     payStatus: {
        type: String,
        enum: ["Paid", "Unpaid"],
        default: "Unpaid",
     },
     paymentMethod: {
        type: String,
        required: true,
        enum: ["COD", "gcash", "paymaya"],
    },
     assignedTo: {
        type: mongoose.Schema.ObjectId,
        ref: RESOURCE.DRIVER,
        required: true,
    },
    deliveredAt: {
        type: Date,
    },
    createdAt: {    
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
    
})

module.exports = mongoose.model(RESOURCE.DELIVERY, deliverySchema);