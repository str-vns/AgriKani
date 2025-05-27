import React, { createContext, useContext, useEffect, useState } from 'react';
import io from "socket.io-client";
import Constants from 'expo-constants';
const SocketContext = createContext(null); 

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {

      const socketConnection = io("http://192.168.50.222:4000", {
        transports: ["websocket"],
        cors: {
          origin: [
            `${Constants?.expoConfig?.extra?.ORIGIN_1}`,
            `${Constants?.expoConfig?.extra?.ORIGIN_2}`,
            `${Constants?.expoConfig?.extra?.ORIGIN_3}`,
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
