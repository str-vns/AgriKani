const Conversation = require("../../models/ChatFeats/conversation");
const ErrorHandler = require("../../utils/errorHandler");
const { STATUSCODE, ROLE } = require("../../constants/index");
const { default: mongoose } = require("mongoose");
const { cloudinary } = require("../../utils/cloudinary");
const Message = require("../../models/ChatFeats/messages")
// NOTE Three DOTS MEANS OK IN COMMENT

//create ...
exports.CreateNewConversationProcess = async (req) => {
  console.log("rec",req); // Debugging the body of the request
  
  if (!req.body || !req.body.senderId || !req.body.receiverId) {
    throw new ErrorHandler("Missing senderId or receiverId");
  }

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

// exports.getSingleConvo = async (req) => {
//     const convo = await Conversation.find(
//       { members: { $in: [req.params.id] } }
//     ).sort({ createdAt: -1 });

//     return convo
// }

exports.getSingleConvo = async (req) => {
  try {
    const convo = await Conversation.find({ members: { $in: [req.params.id] } })
      .lean()
      .then(async (conversations) => {
        for (let conversation of conversations) {
          const latestMessage = await Message.findOne({ conversationId: conversation._id })
            .sort({ createdAt: -1 });
          conversation.latestMessage = latestMessage; // Attach the latest message to the conversation
        }
        return conversations.sort((a, b) => b.latestMessage?.createdAt - a.latestMessage?.createdAt);
      });

    return convo;
  } catch (error) {
    console.error('Error fetching the conversation:', error);
    throw new Error('Failed to fetch the conversation');
  }
};

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