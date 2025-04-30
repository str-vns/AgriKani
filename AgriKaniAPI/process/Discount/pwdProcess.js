const PWD = require("../../models/Discount/pwd");
const ErrorHandler = require("../../utils/errorHandler");
const { STATUSCODE, ROLE } = require("../../constants/index");
const { default: mongoose } = require("mongoose");
const { uploadImageSingle } = require("../../utils/imageCloud");
const { cloudinary } = require("../../utils/cloudinary");
const { sendEmail } = require("../../utils/sendMail");
import admin from 'firebase-admin';

exports.CreatePwdProcess = async (req) => {
    const { frontImage, backImage } = req.files;
    
    if (!frontImage) throw new ErrorHandler("At least one front image is required");
    if (!backImage) throw new ErrorHandler("At least one back image is required");

    const frontImageResult = await uploadImageSingle(frontImage);
    const backImageResult = await uploadImageSingle(backImage);

    if (!frontImageResult) throw new ErrorHandler("Front image upload failed");
    if (!backImageResult) throw new ErrorHandler("Back image upload failed");

    const pwd = await PWD.create({
        ...req.body,
        frontImage: frontImageResult,
        backImage: backImageResult,
    });

    return pwd;
};

exports.GetAllPwdInfoProcess = async () => {
    const pwd = await PWD.find({approvedAt: null})
        .populate({ path: "userId", select: "firstName lastName email image.url phoneNum" })
        .sort({ createdAt: STATUSCODE.NEGATIVE_ONE })
        .lean()
        .exec();

    return pwd;
};

exports.SinglePwdInfoProcess = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ErrorHandler(`Invalid PWD ID: ${id}`);

    const pwd = await PWD.findById(id)
        .populate({ path: "userId", select: "firstName lastName email image.url phoneNum" })
        .lean()
        .exec();
    if (!pwd) throw new ErrorHandler(`PWD not exist with ID: ${id}`);
    return pwd;
}

exports.ApprovedPwdProcess = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ErrorHandler(`Invalid PWD ID: ${id}`);

    const pwdExist = await PWD.findById(id)
        .populate({ path: "userId", select: "firstName lastName email deviceToken" }).lean().exec();
    if (!pwdExist) throw new ErrorHandler(`PWD not exist with ID: ${id}`);

    const email = pwdExist.userId.email;
    const mailOptions = {
        to: email,
        subject: "PWD Approved", 
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>PWD Approved</title>
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
                
                <img src="https://res.cloudinary.com/diljhwf3a/image/upload/v1734260381/images/olwhjvr5dvjhrgbwrcsa.png" 
                    alt="AgriKaAni Logo" 
                    style="max-width: 25%; height: auto;" />
    
                <h4>Hi ${pwdExist.userId?.firstName || "User"}, ${pwdExist.userId?.lastName || ""},</h4> 
                
                <h1>Congratulations! Your PWD Application is Approved!</h1>
                
                <p>We are pleased to inform you that your application has been reviewed and approved.</p>
                
                <p>Thank you for choosing our service! If you have any questions, feel free to contact us.</p>
            </div>
            
            <div class="footer">
                <p>This email was sent from AgriKaAni. &copy; ${new Date().getFullYear()}</p>
            </div>
        </body>
        </html>
        `,
    };

      await sendEmail(mailOptions);
      await sendFcmNotification(
        pwdExist.userId
        , "PWD Approved", 
        "Your PWD Application is Approved!",
        req.body.fcmToken
      );

    const approvedPwd = await PWD.findByIdAndUpdate(
        id,
        {
            approvedAt: Date.now(),
        },
        {
            new: true,
            runValidators: true,
        }
    )
        .lean()
        .exec();
        
    if (!approvedPwd) throw new ErrorHandler(`PWD not approved with ID ${id}`);
    return approvedPwd;
}

exports.DisapprovedPwdProcess = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ErrorHandler(`Invalid User ID: ${id}`);
        }
        
        const pwdExist = await PWD.findById(id)
            .populate({ path: "userId", select: "firstName lastName email deviceToken" })
            .lean()
            .exec();
        
        if (!pwdExist) {
            throw new ErrorHandler("PWD application not found");
        }
        
        const { frontImage, backImage, userId } = pwdExist;
        
        if (!frontImage?.public_id || !backImage?.public_id || !userId) {
            throw new ErrorHandler("Missing required PWD application details");
        }
        
        const frontPublicId = frontImage.public_id;
        const backPublicId = backImage.public_id;
        
        const reasons = [
            "Card and name do not match",
            "Image is blurry",
            "Existing in another account"
        ];
        
        const email = userId.email;
        
        const mailOptions = {
            to: email,
            subject: "PWD Application Disapproved",
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>PWD Application Disapproved</title>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
                        .container { max-width: 600px; margin: 20px auto; padding: 30px; background-color: #ffffff; border-radius: 8px; text-align: center; }
                        h1 { color: #D9534F; font-size: 28px; }
                        p { color: #555; line-height: 1.5; }
                        ul { text-align: left; display: inline-block; color: #555; }
                        .footer { margin-top: 20px; font-size: 12px; color: #aaa; text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h4>Hi ${userId.firstName || "User"} ${userId.lastName || ""},</h4>
                        <h1>We're Sorry, Your PWD Application Has Been Disapproved</h1>
                        <p>After careful review, we regret to inform you that your PWD application has been disapproved due to the following reason(s):</p>
                        <ul>${reasons.map(reason => `<li>${reason}</li>`).join("")}</ul>
                        <p>If you believe this is a mistake or need further clarification, please contact our support team.</p>
                        <p>Thank you for your understanding.</p>
                    </div>
                    <div class="footer">
                        <p>This email was sent from AgriKaAni. &copy; ${new Date().getFullYear()}</p>
                    </div>
                </body>
                </html>`
        };

        await sendEmail(mailOptions);
        
        await sendFcmNotification(userId, "PWD Disapproved", "Your PWD Application has been disapproved.");

        await Promise.all([
            PWD.deleteOne({ _id: id }).lean().exec(),
            cloudinary.uploader.destroy(frontPublicId),
            cloudinary.uploader.destroy(backPublicId)
        ]);
    
        return { success: true, message: "PWD application disapproved successfully" };
    } catch (error) {
        console.error("Error in DisapprovedPwdProcess:", error);
        throw new ErrorHandler(error.message || "An error occurred during the process");
    }
};

exports.GetApprovedPwdProcess = async () => {
    const pwd = await PWD.find({ approvedAt: { $ne: null } })
        .populate({ path: "userId", select: "firstName lastName email image.url phoneNum" })
        .sort({ createdAt: STATUSCODE.NEGATIVE_ONE })
        .lean()
        .exec();

    return pwd;
}

const sendFcmNotification = async (user, title, content, fcmToken) => {
    if (!user.deviceToken || user.deviceToken.length === 0) {
      console.log("No device tokens found for the user.");
      return;
    }
  
    let registrationTokens = user.deviceToken;
    if (fcmToken) {
      registrationTokens = registrationTokens.filter(
        (token) => token !== fcmToken
      );
    }
  
    if (registrationTokens.length === 0) {
      console.log("No valid tokens available for sending notifications.");
      return;
    }
  
    const message = {
      data: {
        key1: "value1",
        key2: "value2",
        key3: "value3",
      },
      notification: {
        title,
        body: content,
      },
      apns: {
        payload: {
          aps: {
            badges: 42,
          },
        },
      },
      tokens: registrationTokens, 
    };
  
    try {
      console.log("Sending notification to the user:", user.email);
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log("Notification sent:", response);
  
      if (response.failureCount > 0) {
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            console.log("Error sending to token:", response.responses[idx].error);
            failedTokens.push(user.deviceToken[idx]);
          }
        });
        console.log("Failed tokens:", failedTokens);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };