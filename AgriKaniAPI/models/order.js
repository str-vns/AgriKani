const mongoose = require('mongoose');
const { RESOURCE } = require('../constants/index');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true,
    },
    orderItems: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, 'Quantity must be at least 1'],
            },
            price: {
                type: Number,
                required: true,
            },
        },
    ],
    shippingAddress: {
        type: mongoose.Schema.ObjectId,
        ref: 'address',
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['COD', 'Credit Card', 'PayPal'],
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    deliveredAt: {
        type: Date,
    },
});

module.exports = mongoose.model(RESOURCE.ORDER, orderSchema);