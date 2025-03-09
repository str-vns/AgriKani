const CheckField = require("../helpers/FieldMonitor");
const asyncHandler = require("express-async-handler");
const walletProcess = require("../process/walletProcess");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE } = require("../constants/index");

exports.createWallet = [
    CheckField([
      "user"
    ]),
    asyncHandler(async (req, res) => {
      const wallet = await walletProcess.createWalletProcess(req);
  
      return SuccessHandler(
        res,
        `Wallet for user ${wallet?.user} has been created Successfully`,
        wallet
      );
    }),
  ];

exports.getWallet = asyncHandler(async (req, res, next) => {
    const wallet = await walletProcess.getWalletProcess(req.params.id);

    return SuccessHandler(
        res,
        `Wallet for user ${wallet?.user} has been fetched Successfully`,
        wallet
    )
})

