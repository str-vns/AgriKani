const { upload } = require("../utils/cloudinary");
const CheckField = require("../helpers/FieldMonitor");
const asyncHandler = require("express-async-handler");
const categoryProcess = require("../process/categoryProcess");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE } = require("../constants/index");

exports.categorieCreate = [
  upload.single("image"),
  CheckField(["categoryName"]),
  asyncHandler(async (req, res) => {
    const category = await categoryProcess.CreateCategory(req);
    return SuccessHandler(
      res,
      `Product: ${category?.categoryName} has been created successfully`,
      category
    );
  }),
];

exports.GetSingleCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id; // Retrieve the category ID from the request parameters

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category fetched successfully',
      details: category,
    });
  } catch (err) {
    return next(new ErrorHandler('Error fetching category', 500, err));
  }
});

exports.GetAllCategories = asyncHandler(async (req, res, next) => {
  const category = await categoryProcess.GetCategory()

  return category?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Category Found"))
    : SuccessHandler(
        res,
        `All Category has been fetched Successfully`,
        category
      );
});

exports.UpdateCategories = [
  // upload.array("image"),
  upload.single("image"), 
  CheckField(["categoryName", "image"]),
  asyncHandler(async (req, res) => {
    const category = await categoryProcess.UpdateCategory(req, req.params.id);
    return SuccessHandler(
      res,
      `Category Name ${category?.categoryName} has been Update Successfully`,
      category
    );
  }),
];

exports.DeleteCategories = asyncHandler(async (req, res, next) => {
  const category = await categoryProcess.DeleteCategory(req.params.id);

  return category?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Category Found"))
    : SuccessHandler(res, category);
});

