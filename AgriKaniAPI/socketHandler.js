const handleSocketConnections = (io) => {
    io.on("connection", (socket) => {
      console.log("A user connected.");
  
      socket.emit("welcome", { message: "Welcome to the Socket.IO server!" });
  
      socket.on("login", (userId) => {
        // You can access users here directly if you import a separate user management module.
        console.log(`User ${userId} logged in with socket ID: ${socket.id}`);
      });
  
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  };
  
  module.exports = handleSocketConnections;