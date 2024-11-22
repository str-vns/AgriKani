const nodemailer = require("nodemailer");

const sendEmailWithAttachment = async (to, subject, text, attachmentPath, html) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    text, // Plain text version
    html, // HTML version for formatted content
    attachments: [
      {
        filename: "receipt.pdf",
        path: attachmentPath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmailWithAttachment;