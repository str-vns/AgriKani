const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionControllers");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLE } = require("../constants/index");

const transactionSchema = [
    {
        method: METHOD.POST,
        path: PATH.TRANSACTION,
        roles: [],
        handler: transactionController.createWithdraw,
    },
    {
        method: METHOD.GET,
        path: PATH.TRANSACTION_PENDING,
        roles: [],
        handler: transactionController.getAllWithdraws,
    },
    {
        method: METHOD.GET,
        path: PATH.TRANSACTION_SUCCESS,
        roles: [],
        handler: transactionController.getAllSuccessWithdraws,
    },
    {
        method: METHOD.GET,
        path: PATH.TRANSACTION_ID,
        roles: [],
        handler: transactionController.singleWithdraw,
    },
    {
        method: METHOD.PUT,
        path: PATH.TRANSACTION_ID,
        roles: [],
        handler: transactionController.updateWithdraw,
    },     
    {
        method: METHOD.GET,
        path: PATH.TRANSACTION_USER_ID,
        roles: [],
        handler: transactionController.getUserWithdraws
    },
    {
        method: METHOD.GET,
        path: PATH.REFUND_PENDING,
        roles: [],
        handler: transactionController.getAllRefunds,
    },
    {
        method: METHOD.GET,
        path: PATH.REFUND_SUCCESS,
        roles: [],
        handler: transactionController.getAllSuccessRefund,
    }
];

transactionSchema.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;
