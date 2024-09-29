const { sendEmail } = require("../utils/sendMail");
const OTP = require("../models/otp");
const ErrorHandler = require("../utils/errorHandler");
const otpGenerator = require("otp-generator");
const User = require("../models/user");

exports.sendOTP = async (req) => {
  const email = req.body.email; 
  const duplicateEmail = await User.findOne({ email })
    .collation({ locale: "en" })
    .lean()
    .exec();

  if (duplicateEmail) throw new ErrorHandler("Email is already Registered");


  let otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });


  let result = await OTP.findOne({ otp });
  while (result) {
    otp = otpGenerator.generate(6, { upperCaseAlphabets: false });
    result = await OTP.findOne({ otp });
  }

  const otpPayload = { email, otp };
  const otpBody = await OTP.create(otpPayload);


  await sendVerificationEmail(email, otp); 

  return otpBody;
};

async function sendVerificationEmail(email, otp) {
  if (!email) {
    throw new ErrorHandler(400, "Email is required to send OTP");
  }

  try {
    const mailOptions = {
      to: email,
      subject: "Verification Email",
      html: `<h1>Please confirm your OTP</h1><p>Here is your OTP code: ${otp}</p>`,
    };

    await sendEmail(mailOptions); 
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error occurred in sendVerificationEmail:", error);
    throw new ErrorHandler(500, "Email could not be sent");
  }
}



