const CheckField = require("../helpers/FieldMonitor");
const asyncHandler = require("express-async-handler");
const transcationProcess = require("../process/transactionProcess");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const { STATUSCODE } = require("../constants/index");

exports.createWithdraw = [
    CheckField([
      "user",
      "amount"
    ]),
    asyncHandler(async (req, res) => {
      const wallet = await transcationProcess.createWithdrawProcess(req);
  
      return SuccessHandler(
        res,
        `Withdrawal for user ${wallet?.user} has been created Successfully`,
        wallet
      );
    }),
  ];

exports.getAllWithdraws = asyncHandler(async (req, res, next) => {
    const withdraws = await transcationProcess.getAllWithdrawsProcess(req);

    return SuccessHandler(
        res,
        `Withdrawals for user ${withdraws?.user} has been fetched Successfully`,
        withdraws
    )
})

exports.getAllSuccessWithdraws = asyncHandler(async (req, res, next) => {
    const withdraws = await transcationProcess.getAllSuccessWithdrawsProcess(req);

    return SuccessHandler(
        res,
        `Withdrawals for user ${withdraws?.user} has been fetched Successfully`,
        withdraws
    )
})

exports.singleWithdraw = asyncHandler(async (req, res, next) => {
    const withdraw = await transcationProcess.singleWithdrawProcess(req.params.id);

    return SuccessHandler(
        res,
        `Withdrawal for user ${withdraw?.user} has been fetched Successfully`,
        withdraw
    )
})

exports.updateWithdraw = [
    CheckField([
        "transactionStatus"
    ]),
    asyncHandler(async (req, res, next) => {
        const withdraw = await transcationProcess.updateWithdrawProcess(req, req.params.id);

        return SuccessHandler(
            res,
            `Withdrawal for user ${withdraw?.user} has been updated Successfully`,
            withdraw
        )
    })
]

exports.getUserWithdraws = asyncHandler(async (req, res, next) => {
    const withdraws = await transcationProcess.getUserWithdrawsProcess(req, req.params.id);

    return SuccessHandler(
        res,
        `Withdrawals for user ${withdraws?.user} has been fetched Successfully`,
        withdraws
    )
})

exports.getAllRefunds = asyncHandler(async (req, res, next) => {
    const refunds = await transcationProcess.getAllRefundProcess();

    return SuccessHandler(
        res,
        `Refunds for user ${refunds?.user} has been fetched Successfully`,
        refunds
    )
})

exports.getAllSuccessRefund = asyncHandler(async (req, res, next) => {
    const refunds = await transcationProcess.getAllSuccessRefundProcess();

    return SuccessHandler(
        res,
        `Refunds for user ${refunds?.user} has been fetched Successfully`,
        refunds
    )
})