const mongoose = require("mongoose");
const validator = require("validator");
const { RESOURCE } = require("../constants/index")
// const crypto = require("crypto");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name!"],
    maxLength: [30, "Your name cannot exceed 30 characters!"],
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
    minlength: [7, "Your password must be longer than 7 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  otp: String 
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

module.exports = mongoose.model(RESOURCE.USER, userSchema)
