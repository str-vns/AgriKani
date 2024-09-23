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
  createdAt: { type: Date, default: Date.now },
});

//Populate
//   const originalPosts = await Post.find({}).populate('author').exec();
// const sharedPosts = await SharedPost.find({}).populate('sharedBy originalPost').exec();
