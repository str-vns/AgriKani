const express = require("express");
const router = express.Router();
const conversationController = require("../../controllers/Chat/conversationControllers");
const { verifyJWT, authorizeRoles } = require("../../middleware/verifyJWT");
const { METHOD, PATH, ROLES } = require("../../constants/index");

const conversationRoutes = [
  {
    method: METHOD.POST,
    path: PATH.CONVERSATION,
    roles: [],
    handler: conversationController.newConversation,
  },
  {
    method: METHOD.GET,
    path: PATH.CONVERSATION_ID,
    roles: [],
    handler: conversationController.getSingleConversation,
  },
  {
    method: METHOD.GET,
    path: PATH.CONVERSATION,
    roles: [],
    handler: conversationController.getConversation,
  },
  {
    method: METHOD.PATCH,
    path: PATH.CONVERSATION_ID,
    roles: [],
    handler: conversationController.SoftDelConvo,
  },
  {
    method: METHOD.PATCH,
    path: PATH.RESTORE_CONVERSATION_ID,
    roles: [],
    handler: conversationController.RestoreConvo,
  },
];

conversationRoutes.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;
