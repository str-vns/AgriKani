const Blog = require("../models/blog");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE } = require("../constants/index");
const { default: mongoose } = require("mongoose");

exports.CreateBlogProcess = async (req) => {
  const blog = await Blog.create({ ...req.body });
  return blog;
};

exports.GetAllBlogs = async () => {
  const blogs = await Blog.find()
    .sort({ createdAt: STATUSCODE.NEGATIVE_ONE })
    .lean()
    .exec();
  return blogs;
};

exports.GetSingleBlog = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Blog ID: ${id}`);
  
  const blog = await Blog.findById(id).lean().exec();
  if (!blog) throw new ErrorHandler(`Blog not found with ID: ${id}`);
  
  return blog;
};

exports.UpdateBlog = async (req, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Blog ID: ${id}`);
  
  const blogExist = await Blog.findById(id).lean().exec();
  if (!blogExist) throw new ErrorHandler(`Blog not found with ID: ${id}`);
  
  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true, runValidators: true }
  ).lean().exec();
  
  if (!updatedBlog) throw new ErrorHandler(`Blog not updated with ID ${id}`);
  
  return updatedBlog;
};

exports.DeleteBlog = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Blog ID: ${id}`);
  
  const blogExist = await Blog.findById(id).exec();
  if (!blogExist) throw new ErrorHandler(`Blog not found with ID: ${id}`);
  
  await Blog.deleteOne({ _id: id }).exec();
  return blogExist;
};

// exports.SoftDeleteBlog = async (id) => {
//   if (!mongoose.Types.ObjectId.isValid(id))
//     throw new ErrorHandler(`Invalid Blog ID: ${id}`);
  
//   const blogExist = await Blog.findById(id).exec();
//   if (!blogExist) throw new ErrorHandler(`Blog not found with ID: ${id}`);
  
//   const softDeletedBlog = await Blog.findByIdAndUpdate(
//     id,
//     { deletedAt: Date.now() },
//     { new: true, runValidators: true }
//   ).lean().exec();
  
//   if (!softDeletedBlog) throw new ErrorHandler(`Blog not soft deleted with ID: ${id}`);
  
//   return softDeletedBlog;
// };

// exports.RestoreBlog = async (id) => {
//   if (!mongoose.Types.ObjectId.isValid(id))
//     throw new ErrorHandler(`Invalid Blog ID: ${id}`);
  
//   const blogExist = await Blog.findById(id).exec();
//   if (!blogExist) throw new ErrorHandler(`Blog not found with ID: ${id}`);
  
//   const restoredBlog = await Blog.findByIdAndUpdate(
//     id,
//     { deletedAt: null },
//     { new: true, runValidators: true }
//   ).lean().exec();
  
//   if (!restoredBlog) throw new ErrorHandler(`Blog not restored with ID: ${id}`);
  
//   return restoredBlog;
// };
