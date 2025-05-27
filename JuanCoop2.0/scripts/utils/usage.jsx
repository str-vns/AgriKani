import React, {useContext, useEffect, useState} from 'react'
import { useSocket } from '@SocketIo';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const isOnline = (props) => {
  const { userId } = props;
  const socket = useSocket();
  const [onlineUsers, setOnlineUsers] = useState([]);


  useEffect(() =>{
   
    if (!userId) {
      console.warn("User ID is missing.");
      return; 
    }

    if (!socket) {
      console.warn("Socket is not initialized.");
      return; 
    }

    socket.emit("addUser", userId);
  
    socket.on("getUsers", (users) => {
      const onlineUsers = users.filter(user => user.online && user.userId !== null); 
      setOnlineUsers(onlineUsers);  
    });
  
    return () => {
      socket.off("getUsers");
    };

  },[socket, userId])
 
  return onlineUsers;
}

export const isUsersOnline = (users, onlineUsers) => {
  if (!Array.isArray(users) || !Array.isArray(onlineUsers)) return false;
  const userIsOnline = users.some(user =>
    onlineUsers.some(
      onlineUser =>
        onlineUser.userId === user.details._id &&
        onlineUser.online &&
        onlineUser.userId !== null
    )
  );
  return userIsOnline;
};

export const getToken = async() => {
  
  try {
    const res = await AsyncStorage.getItem("jwt");
    return res;
  } catch (error) {
    console.error("Error retrieving JWT: ", error);
    return null;
  }
};