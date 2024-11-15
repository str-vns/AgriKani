const asyncHandler = require("express-async-handler");
const blogProcess = require("../process/blogProcess");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE } = require("../constants/index");
const blog = require ('../models/blog');

exports.CreateBlog = asyncHandler(async (req, res, next) => {
  try {
    const blog = await blogProcess.CreateBlogProcess(req);
    return SuccessHandler(
      res,
      `Blog: ${blog._id} has been created successfully`,
      blog
    );
  } catch (error) {
    next(error);
  }
});

exports.GetAllBlogs = asyncHandler(async (req, res, next) => {
    try {
      const blogs = await blogProcess.GetAllBlogs();
      if (blogs?.length === STATUSCODE.ZERO) {
        return next(new ErrorHandler("No Blogs Found", 404));
      }
      return SuccessHandler(res, `All blogs have been fetched successfully`, blogs);
    } catch (error) {
      next(error);
    }
  });

  exports.GetSingleBlog = asyncHandler(async (req, res, next) => {
      try {
        const blog = await blogProcess.GetSingleBlog(req.params.id);
        if (!blog) {
          return next(new ErrorHandler("No Blog Found", 404));
        }
        return SuccessHandler(res, `Blog ${blog._id} has been fetched successfully`, blog);
      } catch (error) {
        next(error);
      }
    });

exports.UpdateBlog = asyncHandler(async (req, res, next) => {
  try {
    const blog = await blogProcess.UpdateBlog(req, req.params.id);
    return SuccessHandler(
      res,
      `Blog ${blog._id} has been updated successfully`,
      blog
    );
  } catch (error) {
    next(error);
  }
});


exports.DeleteBlog = asyncHandler(async (req, res, next) => {
  try {
    const blog = await blogProcess.DeleteBlog(req.params.id);
    if (!blog) {
      return next(new ErrorHandler("No Blog Found", 404));
    }
    return SuccessHandler(res, `Blog ${blog._id} has been deleted successfully`, blog);
  } catch (error) {
    next(error);
  }
});

// exports.SoftDeleteBlog = asyncHandler(async (req, res, next) => {
//   try {
//     const blog = await blogProcess.SoftDeleteBlog(req.params.id);
//     return SuccessHandler(
//       res,
//       `Blog ${blog._id} has been archived successfully`,
//       blog
//     );
//   } catch (error) {
//     next(error);
//   }
// });

// exports.RestoreBlog = asyncHandler(async (req, res, next) => {
//   try {
//     const blog = await blogProcess.RestoreBlog(req.params.id);
//     return SuccessHandler(
//       res,
//       `Blog ${blog._id} has been restored successfully`,
//       blog
//     );
//   } catch (error) {
//     next(error);
//   }
// });
