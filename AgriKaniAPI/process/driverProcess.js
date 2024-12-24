const User = require("../models/user");
const Driver = require("../models/driver");
const Otp = require("../models/otp");
const bcrypt = require("bcrypt");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE, GENDER } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const { uploadImageSingle } = require("../utils/imageCloud");
const { cloudinary } = require("../utils/cloudinary");
const { sendEmail } = require("../utils/sendMail");

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
      .sort({ createdAt: -1 })
      .limit(1)
      .lean()
      .exec();
  
    if (!response) {
      throw new ErrorHandler("Otp is not Valid or Email is not Match");
    }
  
    let images = {};
  
    if (req.files.image) {
      images = await uploadImageSingle(req.files.image[0]);
    }
    if (!images) throw new ErrorHandler("At least one image is required");
  
    let driversLicenseImages = {};
  
    if (req.files.driversLicenseImage) {
      driversLicenseImages = await uploadImageSingle(req.files.driversLicenseImage[0]);
    }
    if (!driversLicenseImages) throw new ErrorHandler("At least one image is required");
 
    const gender = req.body.gender ? req.body.gender : GENDER.PNTS;
  
    const driver = await Driver.create({
      ...req.body,
      password: await bcrypt.hash(req.body.password, Number(process.env.SALT)),
      gender: gender,
      image: images,
      driversLicenseImage: driversLicenseImages,
    });
  
    return driver;
  } catch (error) {
    throw new ErrorHandler(error.message);
  }

  };

exports.getDriverProcess = async () => {
    const driver = await Driver.find({ approvedAt: { $ne: null } }).lean().exec();
    return driver;
};

exports.getDriverDisapproveProcess = async () => {
    const driver = await Driver.find({ approvedAt: null }).lean().exec();
    return driver;
}
   
exports.getDriverByIdProcess = async (id) => {
    const driver = await Driver.findById(id).lean().exec();
    return driver;
};

exports.approveDriverProcess = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Driver ID: ${id}`);

  const driver = await Driver.findById(id).select('+password').exec();

  if (!driver) throw new ErrorHandler(`Driver not exist with ID: ${id}`);

  driver.approvedAt = new Date();

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
      roles: ROLE.DRIVER,
    });

    driver.userId = newUser._id;
    await driver.save();

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
     
    return driver;
};

exports.disapproveDriverProcess = async (id) => {
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
          cloudinary.uploader.destroy(publicIds),
          cloudinary.uploader.destroy(publicIds2),
        ]);

    return driver;

    } catch (error) {
        throw new ErrorHandler(error.message);
    }
}

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
}
