const crypto = require("crypto");

const skey = crypto.randomBytes(32);
const iv = crypto.randomBytes(12);
const algorithm = "aes-256-gcm";

const encryptText = (text) => {
  const cipher = crypto.createCipheriv(algorithm, skey, iv);
  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return { encrypted, authTag, skey, iv };
};

const decryptText = (text, key, iv, tag) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(tag, "hex"));
  let decrypted = decipher.update(text,  "hex", "utf-8");
  decrypted += decipher.final("utf-8");

  return decrypted;
};

module.exports = { encryptText, decryptText };
