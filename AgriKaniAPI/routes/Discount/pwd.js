const express = require("express");
const router = express.Router();
const pwdController = require("../../controllers/Discount/pwdController");
const { verifyJWT, authorizeRoles } = require("../../middleware/verifyJWT");
const { METHOD, PATH, ROLES } = require("../../constants/index");

const pwdRoute = [
    {
        method: METHOD.POST,
        path: PATH.PWD,
        roles: [],
        handler: pwdController.PwdCreate,
    },
    {
        method: METHOD.GET,
        path: PATH.PWD,
        roles: [],
        handler: pwdController.GetAllPwd,
    },
    {
        method: METHOD.GET,
        path: PATH.PWD_ID,
        roles: [],
        handler: pwdController.GetPwdById,
    },
    {
        method: METHOD.PUT,
        path: PATH.PWD_APPROVED_ID,
        roles: [],
        handler: pwdController.ApprovedPwd,
    },
    {
        method: METHOD.DELETE,
        path: PATH.PWD_DISAPPROVED_ID,
        roles: [],
        handler: pwdController.DisapprovedPwd,
    },
    {
        method: METHOD.GET,
        path: PATH.PWD_APPROVED,
        roles: [],
        handler: pwdController.GetApprovedPwd,
    }
];

pwdRoute.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;
