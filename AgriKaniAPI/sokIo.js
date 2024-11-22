// socketIO.js
const socketIO = require("socket.io");
const http = require("http");
const app = require("./app");  
const handleSocketConnections = require("./socketHandler");

const server = http.createServer(app);

const io = socketIO(4000, {
  cors: {
    origin: [
      "https://agrikani.onrender.com/",
      "http://localhost:5173", 
    ],
  },
});


handleSocketConnections(io);

console.log("Socket.IO is running and ready for connections");

module.exports = { io, server };