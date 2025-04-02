const { upload } = require("../utils/cloudinary");
const CheckField = require("../helpers/FieldMonitor");
const asyncHandler = require("express-async-handler");
const productProcess = require("../process/productProcess");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE } = require("../constants/index");
const orderProcess = require('../process/orderProcess');
exports.productCreate = [
  upload.array("image"),
  CheckField(["productName", "description", "image"]),
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
  CheckField(["productName", "description", "image"]),
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

exports.SingleProduct = asyncHandler(async (req, res, next) => {
  const product = await productProcess.singleProduct(req.params.id);

  return product?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Product Found"))
    : SuccessHandler(
        res,
        `${product.productName} has been fetched Successfully`,
        product
      );
});

exports.CoopOnlyProducts = asyncHandler(async (req, res, next) => {
  const coopProducts = await productProcess.CoopOnlyProduct(req.params.id);

  return coopProducts?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Product Found"))
    : SuccessHandler(
        res,
        `All Product has been fetched Successfully`,
        coopProducts
      );
});

exports.CoopOnlyArcProducts = asyncHandler(async (req, res, next) => {
  const coopArcProducts = await productProcess.CoopOnlyArchiveProduct(
    req.params.id
  );

  return coopArcProducts?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Product Found"))
    : SuccessHandler(
        res,
        `All Product has been fetched Successfully`,
        coopArcProducts
      );
});

exports.DeleteProductImage = asyncHandler(async (req, res) => {
  const product = await productProcess.deleteImage(
    req.params.id,
    req.params.imageId
  );

  return SuccessHandler(
    res,
    `Product Image has been deleted Successfully`,
    product
  );
});

exports.ActiveProduct = asyncHandler(async (req, res) => {
  const activeProduct = await productProcess.activeProduct(req.params.id);

  return SuccessHandler(
    res,
    `Product has been activated Successfully`,
    activeProduct
  );
});

exports.getRankedProducts = asyncHandler(async (req, res, next) => {
  try {
    const rankedProducts = await orderProcess.getRankedProducts();
    if (rankedProducts.length === 0) {
      return next(new ErrorHandler("No products found", STATUSCODE.NOT_FOUND));
    }

    return SuccessHandler(res, "Ranked products fetched successfully", rankedProducts);
  } catch (error) {
    return next(new ErrorHandler(error.message, STATUSCODE.SERVER_ERROR));
  }
});

exports.CoopOnlyProducts2 = asyncHandler(async (req, res, next) => {
  const coopProducts = await productProcess.CoopOnlyProduct2(req.params.id);

  return coopProducts?.length === STATUSCODE.ZERO
    ? next(new ErrorHandler("No Product Found"))
    : SuccessHandler(
        res,
        `All Product has been fetched Successfully`,
        coopProducts
      );
});