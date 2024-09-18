const express = require("express");
const router = express.Router();
const messageController = require("../../controllers/Chat/messageControllers");
const { verifyJWT, authorizeRoles } = require("../../middleware/verifyJWT");
const { METHOD, PATH, ROLES } = require("../../constants/index");

const messagesRoutes = [
  {
    method: METHOD.POST,
    path: PATH.MESSAGE,
    roles: [],
    handler: messageController.newMessage,
  },
  {
    method: METHOD.GET,
    path: PATH.MESSAGE_ID,
    roles: [],
    handler: messageController.getMessages,
  },
  {
    method: METHOD.PUT,
    path: PATH.MESSAGE_ID,
    roles: [],
    handler: messageController.unsentMessage,
  },
];

messagesRoutes.forEach((route) => {
  const { method, path, roles = [], handler } = route;
  router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;
