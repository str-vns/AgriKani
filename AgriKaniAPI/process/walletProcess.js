const Wallet = require("../models/wallets");
const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE, ROLE } = require("../constants/index");
const { default: mongoose } = require("mongoose");

exports.createWalletProcess = async(req) => {
    const { user } = req.body;
    const checkUser = await User.findById(user);
    if
    (!checkUser) {
       throw new ErrorHandler("User does not exist", STATUSCODE.NOT_FOUND);
    }
    const wallet = await Wallet.findOne({ user });
    if (wallet) {
        throw new ErrorHandler("Wallet already exists", STATUSCODE.BAD_REQUEST);
    }
    const newWallet = await Wallet.create({ user });
   
    return newWallet;
};


exports.getWalletProcess = async(id) => {
    console.log(id);
    const wallet = await Wallet.findOne({ user: id });
    if (!wallet) {
       throw new ErrorHandler("Wallet not found", STATUSCODE.NOT_FOUND);
    }
   return wallet;
};







