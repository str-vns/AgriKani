const mongoose = require('mongoose');
const validator = require('validator');
const { RESOURCE } = require('../constants/index');

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter the notification title!'],
        maxLength: [150, 'The title cannot exceed 150 characters!'],
    },

    content: {
        type: String,
        required: [true, 'Please provide the notification content!'],
    },
    url: 
    {
      type: String,
      required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true,
    },
    senderId: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 2592000,
    },
    readAt:{
        type: Date,
        default: null,
    }
})

module.exports = mongoose.model(RESOURCE.NOTIFICATION, notificationSchema);