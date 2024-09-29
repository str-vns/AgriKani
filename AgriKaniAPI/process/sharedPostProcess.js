const SPost = require("../models/sharepost");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE } = require("../constants/index");
const { default: mongoose } = require("mongoose");
// NOTE Three DOTS MEANS OK IN COMMENT

//create ...
exports.CreateSharedPostProcess = async (req) => {
  if (!mongoose.Types.ObjectId.isValid(req.body.sharedBy))
    throw new ErrorHandler(`Invalid User ID: ${req.body.sharedBy}`);

  const userId = req.body.sharedBy;
  const origId = req.body.orginalPost;
  const ishared = await SPost.findOne({
    sharedBy: userId,
    orginalPost: origId
});
  
  if(!ishared) {
    const spost = await SPost.create({
      ...req.body,
    });

    return spost;
} else {
   console.log(`You have been Shared this post`)
   throw new ErrorHandler(`You have been Shared this post`)
}

};

//Read ...
exports.GetAllSharedPostInfo = async () => {
  const spost = await SPost.find()
    .sort({ createdAt: STATUSCODE.NEGATIVE_ONE })
    .lean()
    .exec();

  return spost;
};

//Update ...
exports.UpdateSharedPostInfo = async (req, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Shared Post ID: ${id}`);

  const spostExist = await SPost.findById(id).lean().exec();
  if (!spostExist) throw new ErrorHandler(`Shared Post not exist with ID: ${id}`);

  const updateSPost = await SPost.findByIdAndUpdate(
    id,
    {
      sharedComment: req.body.sharedComment,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .lean()
    .exec();
  if (!updateSPost) throw new ErrorHandler(`Shared Post not Update with ID ${id}`);
  return updateSPost;
};

//Delete ...
exports.DeleteSharedPostInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Post ID: ${id}`);

  const spostExist = await SPost.findOne({ _id: id });
  if (!spostExist) throw new ErrorHandler(`Post not exist with ID: ${id}`);
  await Promise.all([
    SPost.deleteOne({ _id: id }).lean().exec(),
    // Category.deleteMany({ product: id}).lean().exec(),
    // Type.deleteMany({ product: id}).lean().exec(),
  ]);

  return spostExist;
};

//SoftDelete ...
exports.SoftDeleteSharedPostInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Shared Post ID: ${id}`);

  const postExist = await SPost.findOne({ _id: id });
  if (!postExist) throw new ErrorHandler(`Shared Post not exist with ID: ${id}`);

  const softDelSPost = await SPost.findByIdAndUpdate(
    id,
    {
      deletedAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .lean()
    .exec();
  if (!softDelSPost) throw new ErrorHandler(`Shared Post not SoftDelete with ID ${id}`);
  return softDelSPost;
};

//Restore ...
exports.RestoreSharedPostInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Shared Post ID: ${id}`);

  const spostExist = await SPost.findOne({ _id: id });
  if (!spostExist) throw new ErrorHandler(`Shared Post not exist with ID: ${id}`);

  const restoresPost = await SPost.findByIdAndUpdate(
    id,
    {
      deletedAt: null,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .lean()
    .exec();
  if (!restoresPost)
    throw new ErrorHandler(`Shared Post was not retrive with ID ${id}`);
  return restoresPost;
};

//Single Post ...
exports.singleSharedPost = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Post ID: ${id}`);

  const spost = await SPost.findById(id).lean().exec();

  if (!spost) throw new ErrorHandler(`Post not exist with ID: ${id}`);

  return spost;
};

exports.userSharedPost = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Post ID: ${id}`);

  const userSPost = await SPost.find({ sharedBy: id }).lean().exec();

  if (!userSPost) throw new ErrorHandler(`User not exist with ID: ${id}`);

  return userSPost;
};

