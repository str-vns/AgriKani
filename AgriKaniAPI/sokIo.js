// socketIO.js
const socketIO = require("socket.io");
const http = require("http");
const app = require("./app");  
const handleSocketConnections = require("./socketHandler");

const server = http.createServer(app);

const io = socketIO(8900, {
  cors: {
    origin: [
      "http://localhost:5173", 
      "http://localhost:4000",
    ],
  },
});

// Pass the io instance to the handler
handleSocketConnections(io);

console.log("Socket.IO is running and ready for connections");

module.exports = { io, server };