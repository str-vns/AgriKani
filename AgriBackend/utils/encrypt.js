require("dotenv").config()
const crypto = require("crypto");
const encryptKey = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8') ;
const iv = crypto.randomBytes(12);
const algorithm = process.env.ALGORITHM_ENCRYPT_DECRYPT;

const encryptText = (data) => {
  const cipher = crypto.createCipheriv(algorithm, encryptKey, iv);
  let encrypted = cipher.update(data, "utf-8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return { encrypted, authTag, iv };
};

const decryptText = (data, iv, tag) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    encryptKey,
    Buffer.from(iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(tag, "hex"));
  let decrypted = decipher.update(data,  "hex", "utf-8");
  decrypted += decipher.final("utf-8");

  return decrypted;
};

module.exports = { encryptText, decryptText };
