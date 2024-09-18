const Message = require("../../models/ChatFeats/messages");
const UnsentMessage = require("../../models/ChatFeats/unsentMessageLog")
const cloudinary = require("cloudinary");
const { STATUSCODE } = require("../../constants/index");
const ErrorHandler = require("../../utils/errorHandler");
const algorithm = "aes-256-gcm";
const crypto = require("crypto");
const skey = crypto.randomBytes(32);
const iv = crypto.randomBytes(12);
const mongoose = require("mongoose");

exports.newMessage = async (req) => {
  if (!req.body) throw new ErrorHandler("No message body", STATUSCODE.BADREQ);

  let image = [];
  if (req.files && Array.isArray(req.files)) {
    image = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          public_id: file.filename,
        });
        return {
          public_id: result.public_id,
          url: result.secure_url,
          originalname: file.originalname,
        };
      })
    );
  }

  const cipher = crypto.createCipheriv(algorithm, skey, iv);
  let encrypted = cipher.update(req.body.text, "utf-8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  console.log(authTag);
  const message = await Message.create({
    ...req.body,
    key: skey.toString("hex"),
    iv: iv.toString("hex"),
    tag: authTag,
    text: encrypted,
    image: image,
  });

  return message;
};

exports.getMesssages = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Message ID: ${id}`);

  const messages = await Message.find({
    conversationId: id,
  });

  const decryptedMessage = messages.map((msg) => {
    let decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(msg.key,"hex"),
      Buffer.from(msg.iv, "hex")
    );
    decipher.setAuthTag(Buffer.from(msg.tag, "hex"));
    let decrypted = decipher.update(msg.text, "hex", "utf-8");
    decrypted += decipher.final("utf-8");

    return { ...msg.toObject(), decryptedText: decrypted };
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

  const cipher = crypto.createCipheriv(algorithm, skey, iv);
  let encrypted = cipher.update("This message was unsent", "utf-8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  const updateMessage = {
    text: encrypted,
    image: hasimage ? [] : messageExist.image,
    key: skey.toString("hex"),
    iv: iv.toString("hex"),
    tag: authTag,
  };
  await Promise.all([
    Message.updateOne({ _id: id }, updateMessage).lean().exec(),
    hasimage
      ? cloudinary.uploader.destroy(publicIds, { resource_type: "image" })
      : Promise.resolve(),
    // Category.deleteMany({ product: id}).lean().exec(),
    // Type.deleteMany({ product: id}).lean().exec(),
  ]);

  await UnsentMessage.create({
    originalMessageId: id,
    sender: messageExist.sender,
    key: messageExist.key,
    iv: messageExist.iv,
    tag: messageExist.tag,
    text: messageExist.text,
    image: messageExist.image,
    unsentAt: new Date(),
  });

  return messageExist;
};
