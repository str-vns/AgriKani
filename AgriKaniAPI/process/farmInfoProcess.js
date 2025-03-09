const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const { cloudinary } = require("../utils/cloudinary");
const { uploadImageMultiple, uploadFileSingle } = require("../utils/imageCloud");
const Farm = require("../models/farm");
const User = require("../models/user");
const Orders = require("../models/order");
const { sendEmail } = require("../utils/sendMail");
const Wallet = require("../models/wallets");
// NOTE Three DOTS MEANS OK IN COMMENT

//create ...
exports.CreateFarmProcess = async (req) => {
  console.log(req.body);
  // const duplicateFarm = await Farm.findOne({ farmName: req.body.farmName })
  //   .collation({ locale: "en" })
  //   .lean()
  //   .exec();
  // if (duplicateFarm) throw new ErrorHandler("Farm Name is already exist");

  const user = await User.findById(req.body.user).exec();
  if (!user) throw new ErrorHandler("User not found");

  // if (!user.roles.includes(ROLE.COOPERATIVE)) {
  //   user.roles.push(ROLE.COOPERATIVE);
  //   await user.save();
  // }

  let image = [];
  if (req.files.image && Array.isArray(req.files.image)) {
    image = await uploadImageMultiple(req.files.image);
  }

  const businessPermit = await uploadFileSingle(req.files.businessPermit[0]);
  const corCDA = await uploadFileSingle(req.files.corCDA[0]);
  const orgStructure = await uploadFileSingle(req.files.orgStructure[0]);

  if (image.length === STATUSCODE.ZERO)
    throw new ErrorHandler("At least one image is required");

  const farm = await Farm.create({
    ...req.body,
    image: image,
    requirements: {
      businessPermit: businessPermit,
      corCDA: corCDA,
      orgStructure: orgStructure,
      tinNumber: req.body.tinNumber,
    },
  });

  const wallet = await Wallet.create({
    user: req.body.user,
    balance: 0,
  });
  
  if (!wallet) throw new ErrorHandler("Wallet not created");

  return farm;
};

//Read ...
exports.GetAllFarm = async () => {
  const farm = await Farm.find({approvedAt: { $ne: null }})
    .populate({ path: "user", select: "firstName lastName email image.url" })
    .sort({ createdAt: STATUSCODE.NEGATIVE_ONE })
    .lean()
    .exec();

  return farm;
};

exports.GetAllInactiveCoop= async () => {
  const farm = await Farm.find({approvedAt: null})
    .populate({ path: "user", select: "firstName lastName email image.url" })
    .sort({ createdAt: STATUSCODE.NEGATIVE_ONE })
    .lean()
    .exec();

  return farm;
}

exports.GetAllofCoop = async () => {
  const farm = await Farm.find()
  .populate({ path: "user", select: "firstName lastName email image.url" })
  .sort({ createdAt: STATUSCODE.NEGATIVE_ONE })
  .lean()
  .exec();

return farm;
};

//Update ...
exports.UpdateFarmInfo = async (req, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Farm ID: ${id}`);

  const farmExist = await Farm.findById(id).lean().exec();
  if (!farmExist) throw new ErrorHandler(`Farm not exist with ID: ${id}`);
  console.log(farmExist, "Full Farm object");

  if (Array.isArray(farmExist.image)) {
    farmExist.image.forEach((img, index) => {
      console.log(img?.public_id, `Image ${index + 1} public_id`);
    });
  } else {
    console.log(
      "farmExist.image is not an array, it is:",
      typeof farmExist.image
    );
  }

  let image = farmExist.image || [];

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const newImages = await uploadImageMultiple(req.files);
    image = [...image, ...newImages];
  }

  const updateFarm = await Farm.findByIdAndUpdate(
    farmExist._id,
    {
      ...req.body,
      image: image,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .lean()
    .exec();
  if (!updateFarm) throw new ErrorHandler(`Farm not Update with ID ${id}`);
  return updateFarm;
};

//Delete ...
exports.DeleteFarmInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Farm ID: ${id}`);

  const farmExist = await Farm.findOne({ _id: id });
  if (!farmExist) throw new ErrorHandler(`Farm not exist with ID: ${id}`);

  const publicIds = farmExist.image.public_id;

  await Promise.all([
    Farm.deleteOne({ _id: id }).lean().exec(),
    cloudinary.uploader.destroy(publicIds),
    // Category.deleteMany({ product: id}).lean().exec(),
    // Type.deleteMany({ product: id}).lean().exec(),
  ]);

  return farmExist;
};

//SoftDelete ...
exports.SoftDeleteFarmInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Farm ID: ${id}`);

  const farmExist = await Farm.findOne({ _id: id });
  if (!farmExist) throw new ErrorHandler(`Farm not exist with ID: ${id}`);

  const softDelFarm = await Farm.findByIdAndUpdate(
    id,
    {
      deletedAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .lean()
    .exec();
  if (!softDelFarm) throw new ErrorHandler(`Farm not SoftDelete with ID ${id}`);
  return softDelFarm;
};

//Restore ...
exports.RestoreFarmInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Farm ID: ${id}`);

  const farmExist = await Farm.findOne({ _id: id });
  if (!farmExist) throw new ErrorHandler(`Farm not exist with ID: ${id}`);

  const restoreFarm = await Farm.findByIdAndUpdate(
    id,
    {
      deletedAt: null,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .lean()
    .exec();
  if (!restoreFarm)
    throw new ErrorHandler(`Farm was not retrive with ID ${id}`);
  return restoreFarm;
};

//Single Product ...
exports.singleFarm = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Farm ID: ${id}`);
     console.log(id, "Farm ID");
  const singleFarm = await Farm.findById(id)
    .populate({ path: "user", select: "firstName lastName email image.url" })
    .lean()
    .exec();
 
  if (!singleFarm) throw new ErrorHandler(`Farmer not exist with ID: ${id}`);

  return singleFarm;
};

exports.FarmDeleteImage = async (farmId, imageId) => {
  if (!mongoose.Types.ObjectId.isValid(farmId)) {
    throw new ErrorHandler(`Invalid Farm ID: ${farmId}`);
  }

  const farmExist = await Farm.findById(farmId).lean().exec();
  if (!farmExist) {
    throw new ErrorHandler(`Farm not exist with ID: ${farmId}`);
  }

  const imageToDelete = farmExist.image.find(
    (img) => img._id.toString() === imageId
  );
  if (!imageToDelete || !imageToDelete.public_id) {
    throw new ErrorHandler(
      `Image with ID: ${imageId} does not exist or does not have a public_id.`
    );
  }

  const publicId = imageToDelete.public_id;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new ErrorHandler(`Cloudinary deletion failed: ${error.message}`);
  }

  await Farm.updateOne({ _id: farmId }, { $pull: { image: { _id: imageId } } });

  return Farm.findById(farmId).exec();
};

exports.CoopOrders = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Farm ID: ${id}`);

  const orders = await Orders.find({ "orderItems.productUser": id })
    .populate({ path: "user", select: "firstName lastName image.url" })
    .populate({
      path: "orderItems.product",
      select: "productName image.url pricing",
    })
    .populate({ path: "shippingAddress", select: "address city" });

  let totalPrice = 0;
  orders.forEach((order) => {
    const orderTotal = order.orderItems.reduce((sum, item) => {
      return sum + (item.price || 0);
    }, 0);

    totalPrice += orderTotal;
  });
  return orders;
};

exports.coopSingle = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Farm ID: ${id}`);

  const singleCoop = await Farm.findOne({ user: id })
    .populate({ path: "user", select: "firstName lastName email image.url" })
    .lean()
    .exec();

  if (!singleCoop) throw new ErrorHandler(`Product not exist with ID: ${id}`);

  return singleCoop;
};

exports.ApproveCoop = async (id, req) => {

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ErrorHandler(`Invalid Farm ID: ${id}`);
    }

    const coopExist = await Farm.findById(id)
    .populate({ path: "user", select: "firstName lastName email image.url" }).lean().exec()

    const email = coopExist.user.email;
    const mailOptions = {
      to: email,
      subject: "Registration Cooperative Approved",
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
                <h4>Hi! ${coopExist.user.firstName}, ${coopExist.user.lastName}<h4>
                <h1>Your Registration for Cooperative is Success!</h1>
                <p>Now you can sell your own product</p>
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
  

    const coopUpdate = await Farm.findByIdAndUpdate(
      id,
      {
        approvedAt: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean()
      .exec();
  
    if (!coopUpdate) {
      throw new ErrorHandler(`Coop not updated with ID ${id}`);
    }
  
 
    const user = await User.findById(req.body.userId).exec();
    if (!user) {
      throw new ErrorHandler("User not found");
    }
  
    if (!user.roles.includes(ROLE.COOPERATIVE)) {
      user.roles.push(ROLE.COOPERATIVE);
      await user.save();
    }
  
    return coopUpdate;
  
  } catch (error) {
    console.error("An error occurred:", error.message);
    throw new ErrorHandler(error.message || "An unexpected error occurred");
  }
}

exports.DisapproveCoop = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Farm ID: ${id}`);

  const coopExist = await Farm.findById(id)
  .populate({ path: "user", select: "firstName lastName email image.url" }).lean().exec()

  const email = coopExist.user.email;
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
              <h4>Hi! ${coopExist.user.firstName}, ${coopExist.user.lastName}<h4>
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

    const publicIds = coopExist.requirements.businessPermit.public_id;
    const publicIds2 = coopExist.requirements.corCDA.public_id;
    const publicIds3 = coopExist.requirements.orgStructure.public_id;
  
          await Promise.all([
            Farm.deleteOne({ _id: id }).lean().exec(),
            cloudinary.uploader.destroy(publicIds),
            cloudinary.uploader.destroy(publicIds2),
            cloudinary.uploader.destroy(publicIds3),
          ]);

  if (!coopUpdate) throw new ErrorHandler(`Coop not Update with ID ${id}`);
  return coopUpdate;
}

exports.singleFarmInfo = async (id) => {
  console.log(id, "Farm ID"); 
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Farm ID: ${id}`);
     console.log(id, "Farm ID");
  const singleFarm = await Farm.findOne({ user: id })
    .populate({ path: "user", select: "firstName lastName email image.url" })
    .lean()
    .exec();
 
  if (!singleFarm) throw new ErrorHandler(`Farmer not exist with ID: ${id}`);

  return singleFarm;
};