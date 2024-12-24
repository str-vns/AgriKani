const mongoose = require('mongoose');
const validator = require('validator');
const { RESOURCE } = require('../constants/index');


const driverSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please enter your First Name!"],
        maxLength: [30, "Your name cannot exceed 30 characters!"],
    },
    lastName: {
        type: String,
        required: [true, "Please enter your Last Name!"],
        maxLength: [30, "Your name cannot exceed 30 characters!"],
    },
    age: {
        type: Number,
        required: [true, "Please enter your Age!"],
        validate: {
            validator: function(value) {
                return value >= 18 && value <= 100;
            },
            message: 'Age must be between 18 and 100'
        }
    },
    gender:
    {
      type: String,
      enum: ["male", "female", "prefer not to say"],
      default: "Prefer not to say",
    },
    phoneNum: {
        type: String,
        required: [true, "Please enter your Last Name!"],
        minlength: [11, "Phone Number must be 11 digits"],
        maxlength: [11, "Phone Number must be 11 digits"],
    },
    email: {
        type: String,
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"],
        required: [true, "Please enter your email"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password "],
        minlength: [8, "Your password must be longer than 8 characters"],
        select: false,
    },
    image: 
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
    driversLicenseImage:
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
    coopId: {
         type: mongoose.Schema.ObjectId,
         ref: RESOURCE.FARMINFO,
         required: true,
     },
     userId: {
            type: mongoose.Schema.ObjectId,
            ref: RESOURCE.USER,
            required: false,
     },
    approvedAt: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
})

module.exports = mongoose.model(RESOURCE.DRIVER, driverSchema);
