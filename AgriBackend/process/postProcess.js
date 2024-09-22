const Post = require("../models/post");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const { cloudinary } = require("../utils/cloudinary");
const { uploadImageMultiple } = require("../utils/imageCloud")
// NOTE Three DOTS MEANS OK IN COMMENT

//create ...
exports.CreatePostProcess = async (req) => {
  console.log("Received File:", req.files);

  let image = [];
  if (req.files && Array.isArray(req.files)) {
    image = await uploadImageMultiple(req.files)
  }

  const post = await Post.create({
    ...req.body,
    image: image,
  });

  return post;
};

//Read ...
exports.GetAllPostInfo = async () => {
  const post = await Post.find()
    .sort({ createdAt: STATUSCODE.NEGATIVE_ONE })
    .lean()
    .exec();

  return post;
};

//Update ...
exports.UpdatePostInfo = async (req, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Post ID: ${id}`);

  const postExist = await Post.findById(id).lean().exec();
  if (!postExist) throw new ErrorHandler(`Post not exist with ID: ${id}`);

if (Array.isArray(postExist.image)) {
 
    postExist.image.forEach((img, index) => {
    console.log(img?.public_id, `Image ${index + 1} public_id`);
  });
} else {
  console.log("productExist.image is not an array, it is:", typeof productExist.image);
}


let image = postExist.image || [];

if (req.files && Array.isArray(req.files)) {
  await Promise.all(
    image.map(async (img, index) => {
      try {
        const result = await cloudinary.uploader.destroy(img.public_id);
        console.log(img?.public_id, `Image ${index + 1} public_id deleted:`, result);
      } catch (error) {
        console.error(`Failed to delete Image ${index + 1}:`, error);
      }
    })
  );
  image = await uploadImageMultiple(req.files);
}

  const updatePost = await Post.findByIdAndUpdate(
    id,
    {
      ...req.body,
      image: image,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .lean()
    .exec();
  if (!updatePost) throw new ErrorHandler(`Product not Update with ID ${id}`);
  return updatePost;
};

//Delete ...
exports.DeletePostInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Post ID: ${id}`);

  const postExist = await Post.findOne({ _id: id });
  if (!postExist) throw new ErrorHandler(`Post not exist with ID: ${id}`);

  const publicIds = postExist.image.public_id;

  await Promise.all([
    Post.deleteOne({ _id: id }).lean().exec(),
    cloudinary.uploader.destroy(publicIds),
    // Category.deleteMany({ product: id}).lean().exec(),
    // Type.deleteMany({ product: id}).lean().exec(),
  ]);

  return productExist;
};

//SoftDelete ...
exports.SoftDeletePostInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Post ID: ${id}`);

  const postExist = await Post.findOne({ _id: id });
  if (!postExist) throw new ErrorHandler(`Post not exist with ID: ${id}`);

  const softDelPost = await Post.findByIdAndUpdate(
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
  if (!softDelPost) throw new ErrorHandler(`Post not SoftDelete with ID ${id}`);
  return softDelPost;
};

//Restore ...
exports.RestorePostInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Post ID: ${id}`);

  const postExist = await Post.findOne({ _id: id });
  if (!postExist) throw new ErrorHandler(`Post not exist with ID: ${id}`);

  const restorePost = await Post.findByIdAndUpdate(
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
  if (!restorePost) throw new ErrorHandler(`Post was not retrive with ID ${id}`);
  return restorePost;
};

//Single Post ...
exports.singlePost = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Post ID: ${id}`);

  const singlePost = await Post.findById(id).lean().exec();

  if (!singlePost) throw new ErrorHandler(`Post not exist with ID: ${id}`);

  return singlePost;
};

exports.userPost = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new ErrorHandler(`Invalid Post ID: ${id}`);
  
    const userPost = await Post.find({ author: id}).lean().exec();
  
    if (!userPost) throw new ErrorHandler(`User not exist with ID: ${id}`);
  
    return userPost;
  };