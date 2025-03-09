const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletControllers");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLE } = require("../constants/index");

const walletRoutes = [
    {
        method: METHOD.POST,
        path: PATH.WALLET,
        roles: [],
        handler: walletController.createWallet,
    },
    {
        method: METHOD.GET,
        path: PATH.WALLET_ID,
        roles: [],
        handler: walletController.getWallet,
    },
];

walletRoutes.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;
