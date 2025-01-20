const User = require("../models/user");
const Farm = require("../models/farm");
const Product = require("../models/product");
const Otp = require("../models/otp");
const bcrypt = require("bcrypt");
const token = require("../utils/token");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE, GENDER } = require("../constants/index");
const { default: mongoose, trusted } = require("mongoose");
const { uploadImageSingle } = require("../utils/imageCloud");
const { cloudinary } = require("../utils/cloudinary");
const uuid = require("uuid");
const { sendEmail } = require("../utils/sendMail");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const blacklistedTokens = [];
const client = new OAuth2(process.env.GOOGLE_CREDS)
// NOTE Three DOTS MEANS OK IN COMMENT

//create ...
exports.registerUser = async (req) => {
  console.log("Received File:", req.file);
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

  if (req.file) {
    images = await uploadImageSingle(req.file);
  }
  if (!images) throw new ErrorHandler("At least one image is required");

  const role = req.body.roles
    ? Array.isArray(req.body.roles)
      ? req.body.roles
      : req.body.roles.split(", ")
    : [ROLE.CUSTOMER];

  const gender = req.body.gender ? req.body.gender : GENDER.PNTS;

  const user = await User.create({
    ...req.body,
    password: await bcrypt.hash(req.body.password, Number(process.env.SALT)),
    roles: role,
    gender: gender,
    image: images,
  });

  return user;
};

//Read ...
exports.GetAllUserInfo = async () => {
  const users = await User.find()
    .sort({ createdAt: STATUSCODE.NEGATIVE_ONE })
    .lean()
    .exec();

  return users;
};

//Update ...
exports.UpdateUserInfo = async (req, id) => {
  console.log("Received File:", req.file);
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid User ID: ${id}`);

  const userExist = await User.findById(id).lean().exec();
  if (!userExist) throw new ErrorHandler(`User not exist with ID: ${id}`);
  console.log(userExist?.image?.public_id, "exist image");

  const duplicateUser = await User.findOne({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    _id: { $ne: id },
  })
    .collation({ locale: "en" })
    .lean()
    .exec();
  if (duplicateUser) throw new ErrorHandler("User already Exist");

  let image_img = userExist.image || {};
  if (req.file) {
    image_img = await uploadImageSingle(req.file);
    await cloudinary.uploader.destroy(`${userExist.image.public_id}`);
  }

  if (image_img.length === STATUSCODE.ZERO)
    throw new ErrorHandler("Required to add one image");

  let roles = userExist.roles || req.body.roles;
  if (req.body.roles) {
    roles = Array.isArray(req.body.roles)
      ? req.body.roles
      : req.body.roles.split(", ");
  }

  const updateUser = await User.findByIdAndUpdate(
    id,
    {
      ...req.body,
      roles: roles,
      image: image_img,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .lean()
    .exec();

  if (!updateUser) throw new ErrorHandler(`User not Update with ID ${id}`);

  await Product.updateMany(
    { "reviews.user": id },
    {
      $set: {
        "reviews.$[elem].avatar": image_img,
        "reviews.$[elem].firstName": req.body.firstName || userExist.firstName,
        "reviews.$[elem].lastName": req.body.lastName || userExist.lastName,
      },
    },
    {
      arrayFilters: [{ "elem.user": id }],
      new: true,
    }
  ).exec();

  return updateUser;
};

//Delete ...
exports.DeleteUserInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid User ID: ${id}`);

  const userExist = await User.findOne({ _id: id });
  if (!userExist) throw new ErrorHandler(`User not exist with ID: ${id}`);

  const publicIds = userExist.image.public_id;

  await Promise.all([
    User.deleteOne({ _id: id }).lean().exec(),
    cloudinary.uploader.destroy(publicIds),
    Farm.deleteMany({ user: id }).lean().exec(),
    // Products.deleteMany({ user: id}).lean().exec(),
    // Transactions.deleteMany({ user: id}).lean().exec(),
    // Reviews.deleteMany({ user: id}).lean().exec(),
  ]);

  return userExist;
};

//SoftDelete ...
exports.SoftDeleteUserInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid User ID: ${id}`);

  const userExist = await User.findOne({ _id: id });
  if (!userExist) throw new ErrorHandler(`User not exist with ID: ${id}`);

  const softDelUser = await User.findByIdAndUpdate(
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
  if (!softDelUser) throw new ErrorHandler(`User not SoftDelete with ID ${id}`);
  return softDelUser;
};

//Restore ...
exports.RestoreUserInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid User ID: ${id}`);

  const userExist = await User.findOne({ _id: id });
  if (!userExist) throw new ErrorHandler(`User not exist with ID: ${id}`);

  const restoreUser = await User.findByIdAndUpdate(
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
  if (!restoreUser) throw new ErrorHandler(`User was no retrive with ID ${id}`);
  return restoreUser;
};

//Profile ...
exports.ProfileUserInfo = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid User ID: ${id}`);

  const singleUser = await User.findById(id).lean().exec();

  if (!singleUser) throw new ErrorHandler(`User not exist with ID: ${id}`);

  return singleUser;
};

exports.SingerUser = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid User ID: ${id}`);

  const singleUser = await User.findById(id).lean().exec();

  if (!singleUser) throw new ErrorHandler(`User not exist with ID: ${id}`);

  return singleUser;
};

exports.getBlacklistedTokens = () => {
  return blacklistedTokens;
};

exports.wishlistProduct = async (productId, id) => {
  console.log(productId);
  console.log(id);
  const product = await Product.findById(productId);
  if (!product) {
    throw new ErrorHandler("Product not found");
  }
  console.log("user: ", id);
  const user = await User.findById(id);
  if (!user) {
    throw new ErrorHandler("User not found");
  }

  const isWished = user.wishlist.findIndex(
    (item) => item.product.toString() === product._id.toString()
  );

  if (isWished === -1) {
    user.wishlist.push({ product: product });
  } else {
    user.wishlist.splice(isWished, 1);
  }

  await user.save();

  return user;
};

exports.wishlistProductGet = async (id) => {
  mongoose.Types.ObjectId.isValid(id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorHandler(`Invalid User ID: ${id}`);
  }

  const userWish = await User.findById(id)
    .populate({
      path: "wishlist.product", // Correct path to populate product
      select: "productName pricing price image.url description stock user",
    })
    .populate({
      path: "wishlist.product.reviews",
      select: "firstName lastName comment rating",
    })
    .lean()
    .exec();
  if (!userWish) {
    throw new ErrorHandler("User not found");
  }
  return userWish;
};

exports.GetTotalUserCount = async () => {
  const count = await User.countDocuments();
  return count;
};

exports.getUserTypeCount = async () => {
  return await User.aggregate([
    { $unwind: "$roles" },  // Unwind the roles array to count each role separately
    {
      $project: {
        // Normalize the role names to lowercase to avoid distinctions like "Cooperative" vs "Cooperatives"
        role: { $toLower: "$roles" },  // Convert role names to lowercase for consistent grouping
      },
    },
    {
      $group: {
        _id: "$role",  // Group by normalized role
        count: { $sum: 1 },  // Count the number of users for each normalized role
      },
    },
    {
      $project: {
        _id: 0,  // Exclude _id
        role: "$_id",  // Include the role name as a field
        count: 1,  // Include the count field
      },
    },
  ]);
};

exports.checkEmail = async (req) => {
  const duplicateEmail = await User.findOne({ email: req.body.email })
    .collation({ locale: "en" })
    .lean()
    .exec();

  if (duplicateEmail) {
    return true;
  } else {
    return false;
  }
}

exports.otpForgotPassword = async (req) => {
  try {
    const response = await Otp.findOne({
      email: req.body.email,
      otp: req.body.otp,
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (!response) {
      throw new ErrorHandler("OTP is not valid or email does not match", 400);
    }

    const resetToken = uuid.v4();

    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    await User.findByIdAndUpdate(
      user._id,
      {
        resetToken: resetToken,
        resetTokenUsed: false,
      },
      { new: true }
    );

    return resetToken;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.resetforgotPassword = async (req) => {
 console.log(req.body.resetToken)
  const user = await User.findOne({
    email: req.body.email,
    resetToken: req.body.resetToken,
  });

  if (!user) {
    throw new ErrorHandler("User not found with this email");
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    throw new ErrorHandler("Password does not match");
  }

  // if (user.resetTokenUsed) {
  //   throw new ErrorHandler("Reset token has been used");
  // }

  const hashedPassowrd = await bcrypt.hash(
    req.body.newPassword,
    Number(process.env.SALT)
  )

  await User.findByIdAndUpdate(user._id, {
    password: hashedPassowrd,
    resetTokenUsed: true,
  });

   return `Password has been reset successfully for user with email ${req.body.email}`;
}

exports.googleLoginWeb = async (req, res) => {
  try{


    const verify = await client.verifyIdToken({ idToken: req.body.credential, audience: process.env.GOOGLE_CREDS });
     console.log(verify.payload, "verify"); 
    const { email_verified, email, given_name, family_name, picture } = verify.payload;
   
    if (!email_verified) return res.status(400).json({ msg: "Email verification failed." });

     const user = await User.findOne({ email });

  if(!user) 
  {
    const newUser = await User.create({
      firstName: given_name,
      lastName: family_name || " " ,
      email: email,
      image: {
        public_id: "google",
        url: picture,
        originalname: "google",
      },
      password: await bcrypt.hash(email + process.env.SALT, 10),
      gender: GENDER.PNTS,
      age: 18,
      phoneNum: "09123456789",
      roles: [ROLE.CUSTOMER],
    });
  }

 const accountUser = await User.findOne({ email }).exec();
  const accessToken = token.generateAccessToken(
    accountUser.email,
    accountUser.roles,
    accountUser.firstName,
    accountUser.lastName,
    accountUser.image
  );
  const accessTokenMaxAge = 7 * 24 * 60 * 60 * 1000;
 console.log(accountUser)
  return {user: accountUser, accessToken, accessTokenMaxAge};

  } catch (error) {
    console.error(error);
    throw error;
  }
}
  
exports.forgotPassword = async (req) => {
  console.log(req.body.email);
  try {
      const resetToken = uuid.v4();
      let user = await User.findOne({ email: req.body.email });

      if (!user) {
       throw new ErrorHandler("User not found", 500); 
      }
 
      const resetUrl = `http://localhost:5174/resetPassword/${resetToken}`;
     const email = req.body.email;
  const mailOptions = {
    to: email,
    subject: `Password Recovery - JuanCoop`,
    html: `
      <section class="max-w-2xl px-6 py-8 mx-auto bg-white dark:bg-gray-900">
      <header>
         <h1> Juan Coop</h1>     
      </header>
  
      <main class="mt-8">
          <h4 class="text-gray-700 dark:text-gray-200">Hi \n\n${user?.firstName}${user?.lastName}\n\n,</h4>
  
          <p class="mt-2 leading-loose text-gray-600 dark:text-gray-300">
              This message Enable you to create New Password In <span class="font-semibold ">JuanCoop</span>.
          </p>
          

             <a href="${resetUrl}" class="button px-6 py-2 mt-4 text-sm font-medium tracking-wider text-white"> New Password</a>
          
          <p class="mt-8 text-gray-600 dark:text-gray-300">
              Thanks, <br>
              JuanCoop
          </p>
      </main>
      
  
      
  </section>
    `,
};

  await sendEmail(mailOptions);

  await User.findByIdAndUpdate(
    user._id,
    {
      resetToken: resetToken,
      resetTokenUsed: false,
    },
    { new: true }
  );

return resetToken;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.resetforgotPasswordWeb = async (req) => {
  console.log(req)
   const user = await User.findOne({
     resetToken: req.params.resetToken,
   });
 
  //  console.log(req.params.resetToken)
   if (!user) {
     throw new ErrorHandler("User not found with this email");
   }
 
   if (req.body.newPassword !== req.body.confirmPassword) {
     throw new ErrorHandler("Password does not match");
   }
 
  //  if (user.resetTokenUsed) {
  //    throw new ErrorHandler("Reset token has been used");
  //  }
 
   const hashedPassowrd = await bcrypt.hash(
     req.body.newPassword,
     Number(process.env.SALT)
   )
 
   await User.findByIdAndUpdate(user._id, {
     password: hashedPassowrd,
     resetTokenUsed: true,
   });
 
    return `Password has been reset successfully for user with email ${user.email}`;
 }