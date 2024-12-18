import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { conversationList } from '@redux/Actions/converstationActions';
import { getUsers } from '@redux/Actions/userActions';
import { useSocket } from '../../../SocketIo';
import Ionicons from 'react-native-vector-icons/Ionicons';

const UserChatlist = () => {
  const dispatch = useDispatch();
  const context = useContext(AuthGlobal);
  const navigation = useNavigation();
  const scrollRef = useRef();
  const socket = useSocket();
  const UserId = context?.stateUser?.userProfile?._id;
  const { loading, conversations } = useSelector((state) => state.converList);
  const { users } = useSelector((state) => state.getThemUser);
  const [selectedChatId, setSelectedChatId] = useState(null); 
  const [token, setToken] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
//   console.log("onlieUsers", onlineUsers);
//  console.log(isOnline);

  // Token retrieval
  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = await AsyncStorage.getItem("jwt");
        setToken(res);
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };
    fetchJwt();
  }, []);
  
  // Fetch conversations
  useEffect(() => {
    if (UserId && token) {
      dispatch(conversationList(UserId, token));
    }
  }, [UserId, token, dispatch]);

  useEffect(() => {
    if (conversations && Array.isArray(conversations) && UserId && token) {
      const friends = conversations.flatMap(conversation =>
        conversation.members.filter(member => member !== UserId)
      );

      if (friends.length > 0) {
        dispatch(getUsers(friends, token)); 
      }
    }
  }, [conversations, UserId, token]);

  // Get online users
  useEffect(() => {
    socket.emit("addUser", UserId);
  
    socket.on("getUsers", (users) => {
      const onlineUsers = users.filter(user => user.online && user.userId !== null);
      // console.log("Filtered online users:", onlineUsers);  
      setOnlineUsers(onlineUsers);  
    });
  
    return () => {
      socket.off("getUsers");
    };
  
  }, [socket, UserId]);  
  
  //isOnline 
  useEffect(() => {
    console.log("All Users:", users);
    console.log("Online Users:", onlineUsers);
  
    if (users && onlineUsers.length > 0) {
      const userIsOnline = users.some(user =>
        onlineUsers.some(onlineUser => 
          onlineUser.userId === user.details._id && onlineUser.online && onlineUser.userId !== null
        )
      ); 
  
      setIsOnline(userIsOnline); 
    } else {
      setIsOnline(false); 
    }
  }, [users, onlineUsers]);


  const isUserOnline = (userId) => {
    return onlineUsers.some(onlineUser => onlineUser.userId === userId && onlineUser.online);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
  style={[styles.chatItem, item.details._id === selectedChatId && styles.selectedChatItem]}
  onPress={() => {
    setSelectedChatId(item.details._id);
    navigation.navigate("ChatMessages", {
      item: item.details,
      conversations: conversations, 
    });
  }}
>
      <View style={styles.leftContainer}>
        {/* Profile Image */}
        <View>
          {item.details?.image?.url ? (
            <View>
            <Image source={{ uri: item.details.image.url }} style={styles.profileImage} />
             <View style={isUserOnline(item.details._id) ? styles.onlineIndicator : styles.offlineIndicator} />
            </View>
          ) : (
            <View>
            <Image source={{ uri: 'https://as2.ftcdn.net/v2/jpg/02/48/15/85/1000_F_248158543_jK3q4R8EQh0AhRtjp5n6CLXGpa0lxJvX.jpg' }} style={styles.profileImage} />
            <View style={isUserOnline(item.details._id) ? styles.onlineIndicator : styles.offlineIndicator} />
            </View>
          )}
       
        </View>
        <View style={styles.chatTextContainer}>
          {/* Name and Message */}
          <Text style={styles.name}>{item.details?.firstName} {item.details?.lastName}</Text>
          <Text style={styles.message}>{item.message}</Text>
        </View>
      </View>
      <View style={styles.rightContainer}>
        {/* Time */}
        <Text style={styles.time}>{item.time}</Text>
        {/* Unread message count (badge) */}
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
       <View style={styles.header}>
        <TouchableOpacity style={styles.drawerButton} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={34} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Message</Text>
      </View>
      <FlatList
        ref={scrollRef}
        data={users} 
        keyExtractor={(item) => item.details._id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Background color
  },
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
  },
  selectedChatItem: {
    backgroundColor: '#fef8e5',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'green',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#fff',
  },
  offlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'gray',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatTextContainer: {
    marginLeft: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    color: '#777',
    marginTop: 2,
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  time: {
    color: '#999',
    fontSize: 12,
  },
  unreadBadge: {
    backgroundColor: '#f7b900',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  unreadCount: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 3,
},
headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    color: '#333',
},
});

export default UserChatlist;
