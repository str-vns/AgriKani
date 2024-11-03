const { upload } = require("../utils/cloudinary");
const CheckField = require("../helpers/FieldMonitor");
const asyncHandler = require("express-async-handler");
const productProcess = require("../process/productProcess");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE } = require("../constants/index");

exports.productCreate = [
  upload.array("image"),
  CheckField(["productName", "description", "pricing", "stock", "image"]),
  asyncHandler(async (req, res) => {
    const product = await productProcess.CreateProductProcess(req);

    return SuccessHandler(
      res,
      `Product: ${product?.productName} has been created successfully`,
      product
    );
  }),
];

exports.GetAllProduct = asyncHandler(async (req, res, next) => {
  const products = await productProcess.GetAllProdductInfo();

  return products?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Product Found"))
    : SuccessHandler(
        res,
        `All Product has been fetched Successfully`,
        products
      );
});

exports.UpdateProduct = [
  upload.array("image"),
  CheckField(["productName", "description", "pricing", "stock", "image"]),
  asyncHandler(async (req, res) => {
    const products = await productProcess.UpdateProductInfo(req, req.params.id);
    return SuccessHandler(
      res,
      `Product Name ${products?.productName} has been Update Successfully`,
      products
    );
  }),
];

exports.DeleteProduct = asyncHandler(async (req, res, next) => {
  const product = await productProcess.DeleteProductInfo(req.params.id);

  return product?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Product Found"))
    : SuccessHandler(res, product);
});

exports.SoftDelProduct = asyncHandler(async (req, res) => {
  const product = await productProcess.SoftDeleteProductInfo(req.params.id);

  return SuccessHandler(
    res,
    `Product ${product.productName} has been put in Archive Successfully`,
    product
  );
});

exports.RestoreProduct = asyncHandler(async (req, res) => {
  const restoreProduct = await productProcess.RestoreProductInfo(req.params.id);

  return SuccessHandler(
    res,
    `The Product ${restoreProduct.productName} has been Restore Successfully`,
    restoreProduct
  );
});

exports.SingleProduct = asyncHandler(async (req, res) => {
  const product = await productProcess.singleProduct(req.params.id);

  return product?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Product Found"))
    : SuccessHandler(
        res,
        `${product.productName} has been fetched Successfully`,
        product
      );
});

exports.CoopOnlyProducts = asyncHandler(async (req, res) => {
  const coopProducts = await productProcess.CoopOnlyProduct(req.params.id);

  return coopProducts?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Product Found"))
    : SuccessHandler(
        res,
        `All Product has been fetched Successfully`,
        coopProducts
      );
});
