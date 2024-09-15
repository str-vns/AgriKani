const mongoose = require("mongoose");
const validator = require("validator");
const { RESOURCE } = require("../constants/index");
// const crypto = require("crypto");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
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
  roles:
  [
    {
      type: String,
      enum: ["Admin", "Employee", "Customer"],
      default: "Customer",
    },
  ],
  gender:
    {
      type: String,
      enum: ["male", "female", "prefer not to say"],
      default: "Prefer not to say",
    },
  wishlist:
  [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: RESOURCE.FPRODUCT,
      },
    },
  ],
  seniorAt:{
    type: Boolean,
    default: false,
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  otp: String,
});

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }
//   this.password = await bcrypt.hash(this.password, 10);
// });

// userSchema.methods.getJwtToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_TIME,
//   });
// };

// userSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// userSchema.methods.getResetPasswordToken = function () {
//   const resetToken = crypto.randomBytes(20).toString("hex");

//   this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

//   return resetToken;
// };

module.exports = mongoose.model(RESOURCE.USER, userSchema);
