const express = require("express");
const router = express.Router();
const seniorController = require("../../controllers/Discount/seniorController");
const { verifyJWT, authorizeRoles } = require("../../middleware/verifyJWT");
const { METHOD, PATH, ROLES } = require("../../constants/index");

const seniorRoute = [
    {
        method: METHOD.POST,
        path: PATH.SENIOR,
        roles: [],
        handler: seniorController.SeniorCreate,
    },
    {
        method: METHOD.GET,
        path: PATH.SENIOR,
        roles: [],
        handler: seniorController.GetAllSenior,
    },
    {
        method: METHOD.GET,
        path: PATH.SENIOR_ID,
        roles: [],
        handler: seniorController.GetSeniorById,
    },
    {
        method: METHOD.PUT,
        path: PATH.SENIOR_APPROVED_ID,
        roles: [],
        handler: seniorController.ApprovedSenior,
    },
    {
        method: METHOD.DELETE,
        path: PATH.SENIOR_DISAPPROVED_ID,
        roles: [],
        handler: seniorController.DisapprovedSenior,
    },
    {
        method: METHOD.GET,
        path: PATH.SENIOR_APPROVED,
        roles: [],
        handler: seniorController.GetApprovedSenior,
    }
];

seniorRoute.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;
