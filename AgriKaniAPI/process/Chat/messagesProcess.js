const Message = require("../../models/ChatFeats/messages");
const UnsentMessage = require("../../models/ChatFeats/unsentMessageLog")
const { STATUSCODE } = require("../../constants/index");
const ErrorHandler = require("../../utils/errorHandler");
const mongoose = require("mongoose");
const { encryptText, decryptText } = require("../../utils/encrypt")
const { uploadImageMultiple } = require("../../utils/imageCloud")
const { cloudinary } = require("../../utils/cloudinary");

exports.newMessage = async (req) => {
  if (!req.body) throw new ErrorHandler("No message body", STATUSCODE.BADREQ);

  let image = [];
  if (req.files && Array.isArray(req.files)) {
    image = await uploadImageMultiple(req.files)
  }

  const {encrypted, authTag, iv} = encryptText(req.body.text)
  console.log(authTag);
  const message = await Message.create({
    ...req.body,
    iv: iv.toString("hex"),
    tag: authTag,
    text: encrypted,
    image: image,
  });

  return { ...req.body };
};

exports.getMesssages = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Message ID: ${id}`);

  const messages = await Message.find({
    conversationId: id,
  });
  const decryptedMessage = messages.map((msg) => {
    if (!msg.text || !msg.iv || !msg.tag) {
      console.warn(`Skipping message with missing fields:`, msg);
      return { ...msg.toObject(), decryptedText: null }; // Skip decryption, return `null` for `decryptedText`
    }
  
    try {
      const decryptedText = decryptText(msg.text, msg.iv, msg.tag);
      return { ...msg.toObject(), decryptedText: decryptedText };
    } catch (error) {
      console.error(`Error decrypting message with id ${msg._id}:`, error);
      return { ...msg.toObject(), decryptedText: null }; // Return `null` if decryption fails
    }
  });

  return decryptedMessage;
};

exports.unsentMessage = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Product ID: ${id}`);

  const messageExist = await Message.findOne({ _id: id });
  if (!messageExist) throw new ErrorHandler(`Message not exist with ID: ${id}`);
  const hasimage = messageExist.image && messageExist.image.length > 0;
  const publicIds = hasimage
    ? messageExist.image.map((img) => img.public_id)
    : [];

  const {encrypted, authTag, skey, iv} = encryptText("This message was unsent")


  const unsentMess = await UnsentMessage.create({
    originalMessageId: id,
    sender: messageExist.sender,
    key: messageExist.key,
    iv: messageExist.iv,
    tag: messageExist.tag,
    text: messageExist.text,
    image: messageExist.image,
    unsentAt: new Date(),
  });

  const updateMessage = {
    text: encrypted,
    image: hasimage ? [] : messageExist.image,
    key: skey.toString("hex"),
    iv: iv.toString("hex"),
    tag: authTag,
  };

  await Promise.all([
    Message.updateOne({ _id: id }, updateMessage).lean().exec(),
    // Category.deleteMany({ product: id}).lean().exec(),
    // Type.deleteMany({ product: id}).lean().exec(),
  ]);


  return unsentMess;
};
