const Wallet = require("../models/wallets");
const User = require("../models/user");
const Transaction = require("../models/transaction");
const ErrorHandler = require("../utils/errorHandler");
const Notification = require("../models/notification");
const Order = require("../models/order");
const Cancelled = require("../models/cancelled");
const { STATUSCODE, ROLE } = require("../constants/index");
const { default: mongoose } = require("mongoose");
const { sendFcmNotification } = require("../services/sendFcmNotif");

exports.createWithdrawProcess = async (req) => {
  console.log(req.body);
  const users = await User.findById(req.body.user);
  if (!users) {
    throw new ErrorHandler("User does not exist", STATUSCODE.NOT_FOUND);
  }

  const withdraw = await Transaction.create({
    user: req.body.user,
    type: "WITHDRAW",
    amount: req.body.amount,
    paymentMethod: req.body.paymentMethod,
    accountName: req.body.accountName,
    accountNumber: req.body.accountNumber,
    transactionStatus: "PENDING",
  });

  const wallet = await Wallet.findOne({ user: req.body.user });
  if (!wallet) {
    throw new ErrorHandler("Wallet not found", STATUSCODE.NOT_FOUND);
  }

      const user = await User.findById("6728323269587b48f9b4fd48")

      if (!user) throw new ErrorHandler("Admin not exist");
      
      await sendFcmNotification(
        user,
        "New Wallet Withdrawal",
        `A new wallet withdrawal has been requested by ${users.firstName} ${users.lastName} with the amount of ${req.body.amount}.`,
        user.deviceToken,
      );

      await Notification.create({
        user: user._id,
        title: "New Wallet Withdrawal",
        type: "driver",
        content: `A new wallet withdrawal has been requested by ${users.firstName} ${users.lastName} with the amount of ${req.body.amount}.`,
      });

  wallet.balance -= req.body.amount;
  await wallet.save();

  return withdraw;
};

exports.getAllWithdrawsProcess = async (req) => {
  const transactions = await Transaction.find({
    type: "WITHDRAW",
    transactionStatus: "PENDING",
  })
    .populate("user", "firstName lastName email")
    .sort({ date: -1 })
    .lean()
    .exec();
  return transactions;
};

exports.getAllSuccessWithdrawsProcess = async (req) => {
  const transactions = await Transaction.find({
    type: "WITHDRAW",
    transactionStatus: "SUCCESS",
  })
    .populate("user", "firstName lastName email")
    .sort({ date: -1 })
    .lean()
    .exec();
  return transactions;
};

exports.singleWithdrawProcess = async (req, id) => {
  const transaction = await Transaction.findById(id);
  return transaction;
};

exports.updateWithdrawProcess = async (req, id) => {
  const transaction = await Transaction.findById(id);
  if (!transaction) {
    throw new ErrorHandler("Transaction not found", STATUSCODE.NOT_FOUND);
  }
  if (req.body.transactionStatus === "FAILED") {
    const wallet = await Wallet.findOne({ user: transaction.user });
    if (!wallet) {
      throw new ErrorHandler("Wallet not found", STATUSCODE.NOT_FOUND);
    }
    wallet.balance += transaction.amount;
    await wallet.save();

    transaction.transactionStatus = req.body.transactionStatus;
    await transaction.save();
    
  } else {
    transaction.transactionStatus = req.body.transactionStatus;
    await transaction.save();
  }

  return transaction;
};

exports.getUserWithdrawsProcess = async (req, id) => {
  const transactions = await Transaction.find({ user: id })
    .sort({ date: -1 })
    .lean()
    .exec();
  return transactions;
};

exports.createRefundProcess = async (req) => {
  console.log(req.body);
  const users = await User.findById(req.body.user);
  if (!users) {
    throw new ErrorHandler("User does not exist", STATUSCODE.NOT_FOUND);
  }

  const withdraw = await Transaction.create({
    user: req.body.user,
    type: "REFUND",
    amount: req.body.amount,
    paymentMethod: req.body.paymentMethod,
    accountName: req.body.accountName,
    accountNumber: req.body.accountNumber,
    transactionStatus: "PENDING",
  });

  const wallet = await Wallet.findOne({ user: req.body.user });
  if (!wallet) {
    throw new ErrorHandler("Wallet not found", STATUSCODE.NOT_FOUND);
  }

  wallet.balance -= req.body.amount;
  await wallet.save();
 
   const user = await User.findById("6728323269587b48f9b4fd48")
      if (!user) throw new ErrorHandler("Admin not exist");

       await sendFcmNotification(
        user,
        "New Refund Request",
        `A new Refund Request has been requested by ${users.firstName} ${users.lastName} with the amount of ${req.body.amount}.`,
        user.deviceToken,
      );

      await Notification.create({
        user: user._id,
        title: "New Refund Request",
        type: "driver",
        content: `A new Refund Request has been requested by ${users.firstName} ${users.lastName} with the amount of ${req.body.amount}.`,
      });

  return withdraw;
};

exports.getAllRefundProcess = async () => {
  const transactions = await Transaction.find({
    type: "REFUND",
    transactionStatus: "PENDING",
  })
    .populate("user", "firstName lastName email")
    .populate("cancelledId")
    .sort({ date: -1 })
    .lean()
    .exec();

  return transactions;
};

exports.getAllSuccessRefundProcess = async (req) => {
  const transactions = await Transaction.find({
    type: "REFUND",
    transactionStatus: "SUCCESS",
  })
    .populate("user", "firstName lastName email")
    .populate("cancelledId")
    .sort({ date: -1 })
    .lean()
    .exec();
  return transactions;
};
