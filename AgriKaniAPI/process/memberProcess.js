const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const { uploadImageSingle } = require("../utils/imageCloud");
const Member = require("../models/members");
const User = require("../models/user");
const Coop = require("../models/farm");
const { sendEmail } = require("../utils/sendMail");
const { cloudinary } = require("../utils/cloudinary");

exports.CreateMemberProcess = async (req) => {
    console.log(req.body, "memeber");
    if (!mongoose.Types.ObjectId.isValid(req.body.userId)) {
        throw new ErrorHandler(`Invalid User ID: ${req.body.userId}`);
    }
    
    const user = await User
        .findById(req.body.userId)
        .lean()
        .exec();
    
    if (!user) {
        throw new ErrorHandler(`User not exist with ID: ${req.body.userId}`);
    }
    
    if (!mongoose.Types.ObjectId.isValid(req.body.coopId)) {
        throw new ErrorHandler(`Invalid Coop ID: ${req.body.coopId}`);
    }
    
    const farm = await Coop.findById(req.body.coopId).lean().exec();
    if (!farm) {
        throw new ErrorHandler(`Farm not exist with ID: ${req.body.coopId}`);
    }
    
    let barangayClearance = null;
    if (req.files && req.files.barangayClearance) {
        barangayClearance = await uploadImageSingle(req.files.barangayClearance[0]);
        if (!barangayClearance) {
            throw new ErrorHandler("Failed to upload Barangay Clearance");
        }
    } else {
        throw new ErrorHandler("Barangay clearance is required");
    }
    
    let validId = null;
    if (req.files && req.files.validId) {
        validId = await uploadImageSingle(req.files.validId[0]);
        if (!validId) {
            throw new ErrorHandler("Failed to upload Valid ID");
        }
    } else {
        throw new ErrorHandler("At least one Valid ID is required");
    }
    
    const member = await Member.create({
        ...req.body,
        barangayClearance,
        validId,
    });
    
    console.log("New member created:", member);
    
    // Return the created member or a response indicating success
    return member

}

exports.GetMemberProcess = async (req) => {
    const member = await Member.find()
        .populate("userId")
        .populate("coopId")
        .lean()
        .exec();
    if (!member) throw new ErrorHandler(`Member not exist with ID: ${req.params.id}`);

    return member;
}

exports.GetMemberListProcess = async (id, req) => {

    const farm = await Coop.findOne({ user: id }).lean().exec();
    const member = await Member
        .find({ coopId: farm._id, approvedAt: { $ne: null } })
        .populate("userId")
        .populate("coopId")
        .lean()
        .exec();
    if (!member) throw new ErrorHandler(`Member not exist with ID: ${req.user._id}`);

    return member;
}

exports.GetMemberListInactiveProcess = async (id, req) => {

    const farm = await Coop.findOne({ user: id }).lean().exec();

    const member = await Member
        .find({ coopId: farm._id, approvedAt: null })
        .populate("userId")
        .populate("coopId")
        .lean()
        .exec();
    if (!member) throw new ErrorHandler(`Member not exist with ID: ${req.user._id}`);

    return member;
}

exports.SingleMemberProcess = async (id) => {
    const member = await Member
    .find({ userId: id })
    .populate({
        path: "userId", 
    })
    .populate({
        path: "coopId", 
        populate: {
            path: "user", 
        }
    })
    .lean()
    .exec();
    if (!member) throw new ErrorHandler(`Member not exist with ID: ${req.user._id}`);

    return member;
}
   
exports.UpdateMemberProcess = async (id, req) => {

    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ErrorHandler(`Invalid Member ID: ${id}`);

    const member = await Member
        .findById(id)
        .lean()
        .exec();
    if (!member) throw new ErrorHandler(`Member not exist with ID: ${id}`);

    if (!mongoose.Types.ObjectId.isValid(req.body.userId))
        throw new ErrorHandler(`Invalid User ID: ${req.body.userId}`);

    const user = await User
        .findById(req.body.userId)
        .lean()
        .exec();
    if (!user) throw new ErrorHandler(`User not exist with ID: ${req.body.userId}`);

    if (!mongoose.Types.ObjectId.isValid(req.body.coopId))
        throw new ErrorHandler(`Invalid Coop ID: ${req.body.coopId}`);

    const farm = await Coop.findById(req.body.coopId).lean().exec();
    if (!farm) throw new ErrorHandler(`Farm not exist with ID: ${req.body.coopId}`);

    let barangayClearance = {};

    if (req.file.barangayClearance) {
        barangayClearance = await uploadImageSingle(req.file.barangayClearance);
    }
    if (!barangayClearance) throw new ErrorHandler("At least barangay clearance is required");

    let validId = {};

    if (req.file.validId) {
        validId = await uploadImageSingle(req.file.validId);
    }
    if (!validId) throw new ErrorHandler("At least one validId  is required");

    const updatedMember = await Member
        .findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                barangayClearance: barangayClearance,
                validId: validId,
            },
            {
                new: true,
                runValidators: true,
            }
        )
        .lean()
        .exec();

    return updatedMember;
}

exports.DeleteMemberProcess = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ErrorHandler(`Invalid Member ID: ${id}`);

    const member = await Member.findById(id).populate("userId").lean().exec();
    if (!member) throw new ErrorHandler(`Member not exist with ID: ${id}`);


    const email = member.userId.email;
    const mailOptions = {
      to: email,
      subject: "Removed Membership",
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
                 <img src="https://res.cloudinary.com/diljhwf3a/image/upload/v1734260381/images/olwhjvr5dvjhrgbwrcsa.png" alt="AgriKaAni Logo" style="max-width: 25%; height: auto;" />
                <h4>Hi! ${member.userId.firstName}, ${member.userId.lastName}<h4>
                <h1>Your Membership in this Cooperative was Removed!</h1>
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

    const publicIds = member.validId.public_id;
    const publicIds2 = member.barangayClearance.public_id;

        await Promise.all([
          User.updateMany({ _id: member.userId._id }, { $pull: { roles: ROLE.MEMBER } }),
          Member.deleteOne({ _id: id }).lean().exec(),
          cloudinary.uploader.destroy(publicIds),
          cloudinary.uploader.destroy(publicIds2),
        ])

    return deletedMember;
}

exports.ApproveMemberProcess = async (id, req) => {
 
    try {
      if (!mongoose.Types.ObjectId.isValid(id))
        throw new ErrorHandler(`Invalid Member ID: ${id}`);

        const member = await Member.findById(id).populate("userId").lean().exec();
        if (!member) throw new ErrorHandler(`Member not exist with ID: ${id}`);

        const email = member.userId.email;
    const mailOptions = {
      to: email,
      subject: "Registration Membership Approved",
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
                 <img src="https://res.cloudinary.com/diljhwf3a/image/upload/v1734251327/images/vuybhnzdnysq50jw3mrk.png" alt="AgriKaAni Logo" style="max-width: 25%; height: auto;" />
                <h4>Hi! ${member.userId.firstName}, ${member.userId.lastName}<h4>
                <h1>Your Registration for Membership is Success!</h1>
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
  

        const updatedMember = await Member.findByIdAndUpdate(
            id,
            {
                approvedAt: new Date(),
            },
            {
                new: true,
                runValidators: true,
            }
        )
            .lean()
            .exec();
        
        if(!updatedMember) throw new ErrorHandler(`Member not exist with ID: ${id}`);

       const user = await User.findById(member.userId._id).lean().exec();
        if (!user) throw new ErrorHandler(`User not exist with ID: ${req.body.userId}`);

        if (!user.roles.includes(ROLE.MEMBER)) {
            user.roles.push(ROLE.MEMBER);
            await User.findByIdAndUpdate(member.userId._id, { roles: user.roles });
        }

        return updatedMember;

    } catch (error) {  
        console.error("An error occurred:", error.message);
        throw new ErrorHandler(error.message || "An unexpected error occurred");
        }
}

exports.DisapproveMemberProcess = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id))
            throw new ErrorHandler(`Invalid Member ID: ${id}`);

        const member = await Member.findById(id).populate("userId").lean().exec();
        if (!member) throw new ErrorHandler(`Member not exist with ID: ${id}`);
    const email = member.userId.email;
  const mailOptions = {
    to: email,
    subject: "Registration Cooperative Not Approved",
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
               <img src="https://res.cloudinary.com/diljhwf3a/image/upload/v1734260381/images/olwhjvr5dvjhrgbwrcsa.png" alt="AgriKaAni Logo" style="max-width: 25%; height: auto;" />
              <h4>Hi! ${member.userId.firstName}, ${member.userId.lastName}<h4>
              <h1>Your Registration for Cooperative is Not Approved!</h1>
              <p>The information you provided was incomplete, did not meet the required criteria</p>
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

    const publicIds = member.validId.public_id;
    const publicIds2 = member.barangayClearance.public_id;

        await Promise.all([
          Member.deleteOne({ _id: id }).lean().exec(),
          cloudinary.uploader.destroy(publicIds),
          cloudinary.uploader.destroy(publicIds2),
        ]);

    return member;
} catch (error) {
    console.error("An error occurred:", error.message);
    throw new ErrorHandler(error.message || "An unexpected error occurred");
}
}
