const User = require("../models/user");
const Driver = require("../models/driver");
const Farm = require("../models/farm");
const Otp = require("../models/otp");
const bcrypt = require("bcrypt");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE, GENDER } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const { uploadImageSingle } = require("../utils/imageCloud");
const { cloudinary } = require("../utils/cloudinary");
const { sendEmail } = require("../utils/sendMail");
const { id } = require("date-fns/locale");
const { bufferedPageRange } = require("pdfkit");
const admin = require("firebase-admin");

exports.registerDriverProcess = async (req) => {
  try {
    const duplicateEmail = await User.findOne({ email: req.body.email })
      .collation({ locale: "en" })
      .lean()
      .exec();

    if (duplicateEmail) throw new ErrorHandler("Email is already exist");

    const phone = req.body.phoneNum;
    if (!phone.match(/^\d{11}$/))
      throw new ErrorHandler("Phone Number must be 11 Digits");
    else if (!phone.startsWith("09"))
      throw new ErrorHandler("Phone Number must be start with 09");
    else if (!phone === STATUSCODE.ZERO)
      throw new ErrorHandler("Phone Number is Required");

    const age = req.body.age;
    if (age < 18 || age > 100)
      throw new ErrorHandler("Age must be between 18 and 100");

    const response = await Otp.findOne({
      email: req.body.email,
      otp: req.body.otp,
    })
      .limit(1)
      .lean()
      .exec();

    if (!response) {
      throw new ErrorHandler("Otp is not Valid or Email is not Match");
    }

    const coopExist = await Farm.findOne({ user: req.body.user }).lean().exec();
    if (!coopExist) throw new ErrorHandler("Coop not exist");

    let images = {};

    if (req.files.image) {
      images = await uploadImageSingle(req.files.image[0]);
    }
    if (!images) throw new ErrorHandler("At least one image is required");

    let driversLicenseImages = {};

    if (req.files.driversLicenseImage) {
      driversLicenseImages = await uploadImageSingle(
        req.files.driversLicenseImage[0]
      );
    }

    if (!driversLicenseImages)
      throw new ErrorHandler("At least one image is required");

    const gender = req.body.gender ? req.body.gender : GENDER.PNTS;

    const driver = await Driver.create({
      ...req.body,
      password: await bcrypt.hash(req.body.password, Number(process.env.SALT)),
      gender: gender,
      image: images,
      driversLicenseImage: driversLicenseImages,
      coopId: coopExist._id,
    });

    return driver;
  } catch (error) {
    throw new ErrorHandler(error.message);
  }
};

exports.getDriverProcess = async () => {
  const driver = await Driver.find({ approvedAt: { $ne: null } })
    .sort({ createdAt: -1 })
    .populate("coopId")
    .lean()
    .exec();
  return driver;
};

exports.getDriverDisapproveProcess = async () => {
  const driver = await Driver.find({ approvedAt: null })
    .sort({ createdAt: -1 })
    .populate("coopId")
    .lean()
    .exec();
  return driver;
};

exports.getDriverByIdProcess = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Cooperative ID: ${id}`);
  
  const coopExist = await Farm.findOne({ user: id })
    .lean()
    .exec()
    
  if (!coopExist) throw new ErrorHandler("Coop not exist");

  const driver = await Driver.find({ coopId: coopExist._id })
    .sort({ createdAt: -1 })
    .lean()
    .exec();
  return driver;
};

exports.approveDriverProcess = async (id, req) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Driver ID: ${id}`);

  const driver = await Driver.findById(id).select("+password").exec();

  if (!driver) throw new ErrorHandler(`Driver not exist with ID: ${id}`);
  driver.isAvailable = true;
  driver.approvedAt = new Date();

  const user = await Farm.findById(driver.coopId).lean().exec();

  const role = ROLE.DRIVER;

  const newUser = await User.create({
    email: driver.email,
    password: driver.password,
    firstName: driver.firstName,
    lastName: driver.lastName,
    age: driver.age,
    image: {
      public_id: driver.image.public_id,
      url: driver.image.url,
      originalname: driver.image.originalname,
    },
    phoneNum: driver.phoneNum,
    gender: driver.gender,
    roles: role,
  });

  driver.userId = newUser._id;
  await driver.save();

  const email = driver.email;
  const mailOptions = {
    to: email,
    subject: "Driver Approved",
    html: `
      <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Driver Not Approved</title>
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
                <h4>Hi! ${driver.firstName}, ${driver.lastName}<h4>
                <h1>Your Driver is Approved!</h1>
                <p>Your driver has been Approve!</p>
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
  await sendFcmNotification(
    user,
    "Driver Approved",
    "Your driver account has been approved",
    req.body.fcmToken
  );

  return driver;
};

exports.getCoopDriverProcess = async (id) => {
  const driver = await Driver.find({ coopId: id, approvedAt: { $ne: null } })
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  return driver;
};

exports.disapproveDriverProcess = async (id, req) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new ErrorHandler(`Invalid Driver ID: ${id}`);

    const driver = await Driver.findById(id).lean().exec();
    if (!driver) throw new ErrorHandler(`Driver not exist with ID: ${id}`);

    const user = await Farm.findById(driver.coopId).lean().exec();

    await sendFcmNotification(
      user,
      "Driver Disapproved",
      "Your driver account has been disapproved due to incomplete information or not meeting the required criteria",
      req.body.fcmToken
    );

    const email = driver.email;
    const mailOptions = {
      to: email,
      subject: "Driver Not Approved",
      html: `
    <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Driver Not Approved</title>
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
              <h4>Hi! ${driver.firstName}, ${driver.lastName}<h4>
              <h1>Your Driver is Not Approved!</h1>
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

    const publicIds = driver.image.public_id;
    const publicIds2 = driver.driversLicenseImage.public_id;

    await Promise.all([
      Driver.deleteOne({ _id: id }).lean().exec(),
      cloudinary.uploader.destroy(publicIds),
      cloudinary.uploader.destroy(publicIds2),
    ]);

    return driver;
  } catch (error) {
    throw new ErrorHandler(error.message);
  }
};

exports.deleteDriverProcess = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new ErrorHandler(`Invalid Driver ID: ${id}`);

    const driver = await Driver.findById(id).lean().exec();
    if (!driver) throw new ErrorHandler(`Driver not exist with ID: ${id}`);
    const email = driver.email;
    const mailOptions = {
      to: email,
      subject: "Driver Not Approved",
      html: `
<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Driver Not Approved</title>
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
          <h4>Hi! ${driver.firstName}, ${driver.lastName}<h4>
          <h1>Your Driver is Not Approved!</h1>
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

    const publicIds = driver.image.public_id;
    const publicIds2 = driver.driversLicenseImage.public_id;

    await Promise.all([
      Driver.deleteOne({ _id: id }).lean().exec(),
      User.deleteOne({ email: driver.email }).lean().exec(),
      cloudinary.uploader.destroy(publicIds),
      cloudinary.uploader.destroy(publicIds2),
    ]);

    return driver;
  } catch (error) {
    throw new ErrorHandler(error.message);
  }
};

exports.getDriverByIdApproveProcess = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Cooperative ID: ${id}`);

  const coopExist = await Farm.findOne({ user: id }).lean().exec();
  if (!coopExist) throw new ErrorHandler("Coop not exist");

  const driver = await Driver.find({
    coopId: coopExist._id,
    approvedAt: { $ne: null },
  })
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  return driver;
};

exports.createAssignedLocationProcess = async (req, id) => {
  try {
    const driver = await Driver.findById(id).lean().exec();
    if (!driver) throw new ErrorHandler(`Driver not exist with ID: ${id}`);

    const coopExist = await Farm.findById(driver.coopId).lean().exec();
    if (!coopExist) throw new ErrorHandler("Coop not exist");

    const locationExists = driver.assignedLocation.some(
      (location) =>
        location.barangay === req.body.barangay &&
        location.city === req.body.city
    );

    if (locationExists) {
      return driver;
    } else {
      const assignedLocation = await Driver.updateOne(
        { _id: id },
        {
          $push: {
            assignedLocation: {
              barangay: req.body.barangay,
              city: req.body.city,
            },
          },
        }
      );
      return assignedLocation;
    }
  } catch (error) {
    throw new ErrorHandler(error.message);
  }
};

exports.removeAssignedLocationProcess = async (req, id) => {
  try {
    const driver = await Driver.findById(id).lean().exec();
    if (!driver) throw new ErrorHandler(`Driver not exist with ID: ${id}`);

    const coopExist = await Farm.findById(driver.coopId).lean().exec();

    if (!coopExist) throw new ErrorHandler("Coop not exist");

    const assignedLocation = await Driver.updateOne(
      { _id: id },
      {
        $pull: {
          assignedLocation: {
            _id: req.body.locationId,
          },
        },
      }
    );

    return assignedLocation;
  } catch (error) {
    throw new ErrorHandler(error.message);
  }
};

exports.updateAvailabilityProcess = async (id) => {
  try {
    const user = await User.findById(id).lean().exec();
    const driver = await Driver.findOne({ userId: user._id }).exec();

    if (!driver) throw new ErrorHandler(`Driver not exist with ID: ${id}`);

    driver.isAvailable = !driver.isAvailable;
    await driver.save();

    return driver;
  } catch (error) {
    throw new ErrorHandler(error.message);
  }
};

exports.maxCapacityProcess = async (req, id) => {
  try {
    const driver = await Driver.findById(id).lean().exec();
    if (!driver) throw new ErrorHandler(`Driver not exist with ID: ${id}`);

    if (driver.maxCapacity === STATUSCODE.ZERO)
      throw new ErrorHandler("Max Capacity is Required");

    if (driver.maxCapacity >= 100)
      throw new ErrorHandler("Max Capacity must be not greater than 100");

    const drivers = await Driver.updateOne(
      { _id: id },
      { $set: { maxCapacity: req.body.capacity } }
    );

    return drivers;
  } catch (error) {
    throw new ErrorHandler(error.message);
  }
};

exports.getSingleDriverProcess = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Driver ID: ${id}`);

  const driver = await Driver.findOne({ userId: id })
    .lean()
    .exec();
  if (!driver) throw new ErrorHandler(`Driver not exist with ID: ${id}`);

  return driver;
};

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
