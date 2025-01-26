const asyncHandler = require('express-async-handler');
const cancelledProcess = require('../process/cancelledProcess');
const SuccessHandler = require('../utils/successHandler');
const ErrorHandler = require('../utils/errorHandler');
const { STATUSCODE } = require('../constants/index');
const Cancelled = require('../models/cancelled');

exports.CreateCancelled = asyncHandler(async (req, res, next) => {
    try {
        const cancelled = await cancelledProcess.CreateCancelledProcess(req);
        return SuccessHandler(
        res,
        `Cancelled: ${cancelled._id} has been created successfully`,
        cancelled
        );
    } catch (error) {
        next(error);
    }
    });

exports.GetAllCancelled = asyncHandler(async (req, res, next) => {
    try {
        const cancelled = await cancelledProcess.GetAllCancelled();
        if (cancelled?.length === STATUSCODE.ZERO) {
            return next(new ErrorHandler('No Cancelled Found', 404));
        }
        return SuccessHandler(res, 'All cancelled have been fetched successfully', cancelled);
    } catch (error) {
        next(error);
    }
    });

exports.GetSingleCancelled = asyncHandler(async (req, res, next) => {
    try {
        const cancelled = await cancelledProcess.GetSingleCancelled(req.params.id);
        if (!cancelled) {
            return next(new ErrorHandler('No Cancelled Found', 404));
        }
        return SuccessHandler(res, `Cancelled ${cancelled._id} has been fetched successfully`, cancelled);
    } catch (error) {
        next(error);
    }
    });

