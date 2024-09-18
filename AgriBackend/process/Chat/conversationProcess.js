const Conversation = require("../../models/ChatFeats/conversation");
const ErrorHandler = require("../../utils/errorHandler");
const { STATUSCODE, ROLE } = require("../../constants/index");
const { default: mongoose } = require("mongoose");
const { cloudinary } = require("../../utils/cloudinary");

// NOTE Three DOTS MEANS OK IN COMMENT

//create ...
exports.CreateNewConversationProcess = async (req) => {
console.log(req.body)
 if(!req.body)
    throw new ErrorHandler("Not Sender and receiver Ids")
  const conversation = await Conversation.create({
    members: [req.body.senderId, req.body.receiverId]
  });

  return conversation;
};

//Read ...
exports.GetAllConvo = async () => {
  const convo = await Conversation.find()
    .sort({ createdAt: STATUSCODE.NEGATIVE_ONE })
    .lean()
    .exec();

  return convo;
};

exports.getSingleConvo = async (req) => {
    const convo = await Conversation.find(
        {
            members: { $in: [req.params.id]},
        }
    )

    return convo
}

exports.SoftdeleteConvo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid User ID: ${id}`);

  const convoExist = await Conversation.findOne({ _id: id });
  if (!convoExist) throw new ErrorHandler(`Conversation not exist with ID: ${id}`);

  const softDelConvo = await Conversation.findByIdAndUpdate(
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
  if (!softDelConvo) throw new ErrorHandler(`Conversation not SoftDelete with ID ${id}`);
  return softDelConvo;
}

exports.RestoreConvo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid User ID: ${id}`);

  const convoExist = await Conversation.findOne({ _id: id });
  if (!convoExist) throw new ErrorHandler(`Conversation not exist with ID: ${id}`);

  const restoreConvo = await Conversation.findByIdAndUpdate(
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
  if (!restoreConvo) throw new ErrorHandler(`Conversation not SoftDelete with ID ${id}`);
  return restoreConvo;
}