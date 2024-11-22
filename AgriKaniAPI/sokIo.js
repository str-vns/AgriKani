const socketIO = require("socket.io");
const http = require("http");
const app = require("./app");  // Import your Express app
const handleSocketConnections = require("./socketHandler");  // Import your socket event handler

// Create an HTTP server using the app
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = socketIO(server, {
  cors: {
    origin: [
      "https://agrikani.onrender.com",  // Production URL
      "http://localhost:5173",          // Local development frontend URL
      "http://localhost:4000",          // Local development backend URL (if applicable)
    ],
    methods: ["GET", "POST"],  // Allowed methods (optional)
  },
});

// Set up the socket event handler (handling connections)
handleSocketConnections(io);

console.log("Socket.IO is running and ready for connections");

// Make sure the server listens on the correct port
const PORT = process.env.PORT || 8900;  // Use environment variable or default to 8900
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { io, server };