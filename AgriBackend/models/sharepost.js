const mongoose = require("mongoose");
const validator = require("validator");
const { RESOURCE } = require("../constants/index");

const sharedPostSchema = new mongoose.Schema({
  originalPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  sharedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sharedComment: { type: String, default: "" },
  deletedAt: { type: Date, default: null},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model(RESOURCE.SHAREPOST, sharedPostSchema);
//Populate
//   const originalPosts = await Post.find({}).populate('author').exec();
// const sharedPosts = await SharedPost.find({}).populate('sharedBy originalPost').exec();
