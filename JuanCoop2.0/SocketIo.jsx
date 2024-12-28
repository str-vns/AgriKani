import React, { createContext, useContext, useEffect, useState } from 'react';
import io from "socket.io-client";
import  config  from "@config";
// const SOCKET_SERVER_URL = `${config.SOCKET_ADDRESS}`;
// console.log(SOCKET_SERVER_URL, "SOCKET_SERVER_URL");
const SocketContext = createContext(null); 

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    // https://agrikani.onrender.com
    // http://192.168.50.236:4000
    useEffect(() => {

      const socketConnection = io("http://192.168.50.222:4000", {
        transports: ["websocket"],
        cors: {
          origin: [
            "http://localhost:5173",
            "https://agrikani.onrender.com:8900",
            "http://localhost:4000",
          ],
        },
      });
  
      setSocket(socketConnection);
  
      socketConnection.on("connect", () => {
        console.log("Connected to Socket.IO server");
      });
  
      socketConnection.on("Has Been Connected", (data) => {
        console.log(data.message);
      });
  
      socketConnection.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });
  
      socketConnection.on("disconnect", () => {
        console.log("Disconnected from Socket.IO server");
      });
  
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
