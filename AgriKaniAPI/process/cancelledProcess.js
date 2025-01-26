const Cancelled = require("../models/cancelled");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE } = require("../constants/index");
const { default: mongoose } = require("mongoose");

exports.CreateCancelledProcess = async (req) => {
   
    const cancelled = await Cancelled.create({ ...req.body });
    
    return cancelled;
}

exports.GetAllCancelled = async () => {
    const cancelled = await Cancelled.find()
      .sort({ createdAt: STATUSCODE.NEGATIVE_ONE })
      .lean()
      .exec();
    return cancelled;
}

exports.GetSingleCancelled = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new ErrorHandler(`Invalid Cancelled ID: ${id}`);
    
    const cancelled = await Cancelled.findById(id).lean().exec();
    if (!cancelled) throw new ErrorHandler(`Cancelled not found with ID: ${id}`);
    
    return cancelled;
}

