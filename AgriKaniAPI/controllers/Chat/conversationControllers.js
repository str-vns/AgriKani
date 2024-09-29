const CheckField = require("../../helpers/FieldMonitor");
const asyncHandler = require("express-async-handler");
const convProcess = require("../../process/Chat/conversationProcess");
const SuccessHandler = require("../../utils/successHandler");
const { STATUSCODE } = require("../../constants/index");

exports.newConversation = [
    // CheckField("senderId","receiverId"),
  asyncHandler(async (req, res) => {
    const conversation = await convProcess.CreateNewConversationProcess(req);

    SuccessHandler(
     res,
      `Successfully created new Conversation ${conversation?._id}`,
      {
        conversation,
      }
    );
  }),
];

exports.getConversation = asyncHandler(async (req, res) => {
    const getConvo = await convProcess.GetAllConvo();

    return getConvo?.length === STATUSCODE.ZERO
      ? next(new ErrorHandler("No Conversation Found"))
      : SuccessHandler(res, `All Conversation has been fetched Successfully`, getConvo);
});

exports.getSingleConversation = asyncHandler(async (req, res) =>
{
    const convo = await convProcess.getSingleConvo(req)

    SuccessHandler(
        res,
        `Successfully fetched conversation`,
        convo
    )
}

)

exports.SoftDelConvo = asyncHandler(async (req, res) => {
  const convo = await convProcess.SoftdeleteConvo(req.params.id)

  return SuccessHandler(
    res,
    `Conversation ${convo._id} has been put in Archive Successfully`,
    convo
  );
});


exports.RestoreConvo = asyncHandler(async (req, res) => {
  const convo = await convProcess.RestoreConvo(req.params.id)

  return SuccessHandler(
    res,
    `Conversation ${convo._id} has been put in Restore Successfully`,
    convo
  );
});