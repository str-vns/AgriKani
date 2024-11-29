import React, { createContext, useContext, useEffect, useState } from 'react';
import io from "socket.io-client";
import  config  from "@config";
// const SOCKET_SERVER_URL = `${config.SOCKET_ADDRESS}`;
// console.log(SOCKET_SERVER_URL, "SOCKET_SERVER_URL");
const SocketContext = createContext(null); // Use createContext instead of useState

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
      // Create a Socket.IO connection
      const socketConnection = io("https://agrikani.onrender.com", {
        transports: ["websocket"],
        cors: {
          origin: [
            "http://localhost:5173", // Local development URL
            "https://agrikani.onrender.com:8900", // Production frontend URL
          ],
        },
      });
  
      // Set the socket connection
      setSocket(socketConnection);
  
      // Listen for successful connection
      socketConnection.on("connect", () => {
        console.log("Connected to Socket.IO server");
      });
  
      socketConnection.on("Has Been Connected", (data) => {
        console.log(data.message);
      });
  
      // Handle connection errors
      socketConnection.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });
  
      // Handle disconnection
      socketConnection.on("disconnect", () => {
        console.log("Disconnected from Socket.IO server");
      });
  
      // Clean up the socket connection on unmount
      return () => {
        if (socketConnection) {
          console.log("Disconnecting from Socket.IO server...");
          socketConnection.disconnect();
          console.log("Disconnected from Socket.IO server");
        }
      };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
          {children}
        </SocketContext.Provider>
    );
}

export const useSocket = () => {
    return useContext(SocketContext);
}
