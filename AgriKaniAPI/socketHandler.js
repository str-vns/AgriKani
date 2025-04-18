const handleSocketConnections = (io) => {
  let users = [];


  const addUser = (userId, socketId) => {
    const existingUser = users.find(user => user.userId === userId);

    if (existingUser) {
      existingUser.socketId = socketId;
      existingUser.online = true;  
    } else {
      users.push({ userId, socketId, online: true });
    }
  };

  const removeUser = (socketId) => {
    const userIndex = users.findIndex(user => user.socketId === socketId);  // Find the user by socketId
    if (userIndex !== -1) {
      users[userIndex].online = false;
      console.log(`User with socketId ${socketId} is now offline.`, users);
    } else {
      console.log(`No user found with socketId ${socketId}`);
    }
  };


  const getUser = (userId) => {
    return users.find(user => user.userId === userId);
  };

  io.on("connection", (socket) => {
    console.log("Client connected");
    
    
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);  
    });

    socket.on("sendMessage", ({ senderId, receiverId, text, image }) => {
      console.log(`Server received sendMessage event with senderId: ${senderId}, receiverId: ${receiverId}, text: ${text}, image: ${text}`);
      const user = getUser(receiverId);
    
      if (user && user.socketId) {
        console.log(`Emitting to user with socketId: ${user.socketId}`);
        io.to(user.socketId).emit("getMessage", { senderId, text, image });
      } else {
        console.log(`User with receiverId ${receiverId} not found or doesn't have a valid socketId.`);
      }
    });

    socket.on("sendNotification", ({ senderName, receiverName, type }) => {
      const user = getUser(receiverName);
      if (user && user.socketId) {
        io.to(user.socketId).emit("getNotification", { senderName, type });
      } else {
        console.error("User or socketId not found for receiver:", receiverName);
      }
    });

    socket.on("removeUser", (socketId) => {
      console.log(`Server received removeUser event with socketId: ${socketId}`); 
    
      removeUser(socketId);  
    
      io.emit("getUsers", users); 
    });

    // socket.on('updateLocation', (data) => {
    //    console.log(`Server received updateLocation event with data: ${data}`);
    //    socket.broadcast.emit('locationUpdate', data);
    // })

    socket.on('deliveryLocationUpdate', (data) => {
      console.log('Location update received:', data);
      const user = getUser(data.receiverId);

      if (user && user.socketId) {
        console.log(`Emitting to user with socketId: ${user.socketId}`);
      io.emit('updateDeliveryLocation', data.lng, data.lat);
      io.to(user.socketId).emit('getDeliveryLocation', { latitude: data.lat, longitude: data.lng, senderId: data.senderId, deliveryId: data.deliveryId, status: data.status, currentRoute: data.currentRoute });
      } else {
      console.error(`User with receiverId ${data.userId} not found or doesn't have a valid socketId.`);
      }
    });
    
    socket.on("disconnect", () => {
      console.log(`User disconnected with socketId: ${socket.id}`);
      removeUser(socket.id);  
      io.emit("getUsers", users);  
    });
   
  });
};

module.exports = handleSocketConnections;
