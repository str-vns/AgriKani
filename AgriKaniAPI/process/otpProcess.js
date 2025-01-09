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

  // if (duplicateEmail) throw new ErrorHandler("Email is already Registered");

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
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AgriKaAni OTP Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 30px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                h1 {
                    color: #333;
                    font-size: 28px;
                    margin-bottom: 10px;
                }
                p {
                    color: #555;
                    line-height: 1.5;
                    margin-bottom: 20px;
                }
                .otp {
                    display: inline-block;
                    padding: 15px 30px;
                    font-size: 32px;
                    font-weight: bold;
                    color: #fff;
                    background-color: #f7b900;
                    border-radius: 5px;
                    text-decoration: none;
                    margin: 10px 0;
                }
                .logo {
                    margin-bottom: 20px;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #aaa;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="container">
                 <div class="logo" style="text-align: center;">
    <img src="https://res.cloudinary.com/diljhwf3a/image/upload/v1734251324/images/voxnhndpnquj24onbmhf.png" 
         alt="AgriKaAni Logo" 
         style="max-width: 10%; height: auto; display: block; margin: 0 auto;"/>
    <p class="text" style="margin-top: 0px; font-size: 16px; font-weight: bold; color: #333;">
        Juan Coop
    </p>
</div>
                <h1>Welcome to AgriKaAni!</h1>
                <p>Your OTP code is:</p>
                <p><span class="otp">${otp}</span></p>
                <p>Thank you for using our service!</p>
            </div>
            <div class="footer">
                <p>This email was sent from AgriKaAni. &copy; ${new Date().getFullYear()}</p>
            </div>
        </body>
        </html>
      `,
    };

    await sendEmail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error occurred in sendVerificationEmail:", error);
    throw new ErrorHandler(500, "Email could not be sent");
  }
}