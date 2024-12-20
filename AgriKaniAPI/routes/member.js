const express = require("express");
const router = express.Router();
const memberControllers = require("../controllers/memberControllers");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLE } = require("../constants/index");
const { path } = require("pdfkit");


const memberRoutes = [
    {
        method: METHOD.POST,
        path: PATH.MEMBER,
        roles: [],
        handler: memberControllers.CreateMember,
    },
    {
        method: METHOD.GET,
        path: PATH.MEMBER,
        roles: [],
        handler: memberControllers.GetMember,
    },
    {
        method: METHOD.PUT,
        path: PATH.MEMBER_ID,
        roles: [],
        handler: memberControllers.UpdateMember,
    },
    {
        method: METHOD.DELETE,
        path: PATH.MEMBER_ID,
        roles: [],
        handler: memberControllers.DeleteMember,
    },
    {
        method: METHOD.GET,
        path: PATH.MEMBER_ID,
        roles: [],
        handler: memberControllers.SingleMember,
    },
    {
        method: METHOD.PATCH,
        path: PATH.MEMBER_APPROVED_ID,
        roles: [],
        handler: memberControllers.ApprovedMember,
    },
    {
        method: METHOD.PATCH,
        path: PATH.MEMBER_DISAPPROVED_ID,
        roles: [],
        handler: memberControllers.DisapprovedMember,
    },
    {
        method: METHOD.GET,
        path: PATH.MEMBERLIST,
        roles: [],
        handler: memberControllers.GetMemberList,
    },
    {
        method: METHOD.GET,
        path: PATH.MEMBER_INACTIVE,
        roles: [],
        handler: memberControllers.GetMemberListInactive,
    }
];

memberRoutes.forEach((route) => {
    const { method, path, roles = [], handler } = route;
    router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;