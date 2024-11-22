const socketIO = require("socket.io");
const http = require("http");
const app = require("./app");
const handleSocketConnections = require("./socketHandler");

const server = http.createServer(app);

// Start socket.io on port 4000
const io = socketIO(server, {
  cors: {
    origin: [
      "https://agrikani.onrender.com",
      "http://localhost:5173", // your local dev URL for testing
    ],
  },
});

handleSocketConnections(io);

server.listen(4000, () => {
  console.log("Socket.IO server running on port 4000");
});

module.exports = { io, server };