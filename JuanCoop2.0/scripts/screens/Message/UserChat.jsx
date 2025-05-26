import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import Message from "./UserMessage";
import { useSelector, useDispatch } from "react-redux";
import { useSocket } from "../../../SocketIo";
import { listMessages, sendingMessage } from "@redux/Actions/messageActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "@redux/Store/AuthGlobal";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { sendNotifications } from "@redux/Actions/notificationActions";
import messaging from "@react-native-firebase/messaging";
import { useNavigation } from "@react-navigation/native";
const UserChat = (props) => {
  const { item, conversations, isOnline } = props.route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const socket = useSocket();
  const scrollRef = useRef(null);
  const context = useContext(AuthGlobal);
  const UserId = context?.stateUser?.userProfile?._id;
  const { messages } = useSelector((state) => state.getMessages);
  const [token, setToken] = useState(null);
  const [arrivedMessages, setArrivedMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [images, setImages] = useState([]);
  const [fcmToken, setFcmToken] = useState("");
  const validConversations = Array.isArray(conversations) ? conversations : [];
  console.log("validConversations", item?._id)
  const myConvo = validConversations.find((convo) =>
    convo.members.includes(item?._id)
  );
  const isOnlinerUser = isOnline.find((user) => user.userId === item?._id);
  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArrivedMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: data.senderId,
          text: data.text,
          image: data.image,
          createdAt: Date.now(),
        },
      ]);
    });

    return () => {
      socket.off("getMessage");
    };
  }, [socket]);


  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = await AsyncStorage.getItem("jwt");
        const fcmToken = await messaging().getToken();
        setFcmToken(fcmToken);
        setToken(res);
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };
    fetchJwt();
  }, []);


  useEffect(() => {
    if (token && myConvo) {
      dispatch(listMessages(myConvo._id, token));
    }
  }, [token, myConvo, dispatch]);

  useEffect(() => {
    if (scrollRef.current && messages && messages.length > 0) {
      scrollRef.current.scrollToEnd({ animated: false });
    }
  }, [messages, arrivedMessages]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;

      setImages((prevImages) => [...prevImages, uri]);
    } else {
      console.log("No image selected or an error occurred.");
    }
  };

  const deleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const sendMessage = async () => {
    if (newMessage.trim() || images.length) {
      // Ensure conversation exists
      if (!myConvo) {
        console.log("Conversation does not exist yet.");
        return;
      }
  
      const message = {
        sender: UserId,
        text: newMessage,
        conversationId: myConvo._id,
        image: images,
      };
  
      // Emit message via socket
      socket.emit("sendMessage", {
        senderId: UserId,
        receiverId: myConvo.members.find((member) => member !== UserId),
        text: newMessage,
        image: images,
      });
  
      // Send notification if the receiver is offline
      if (!isOnlinerUser) {
        const notification = {
          title: `New message`,
          content: `You have a new message from ${context?.stateUser?.userProfile?.firstName} ${context?.stateUser?.userProfile?.lastName}`,
          user: item._id,
          url: item.image.url,
          fcmToken: fcmToken,
          type: "message",
        };
        dispatch(sendNotifications(notification, token));
      }
  
      // Dispatch the message to Redux
      dispatch(sendingMessage(message, token));
  
      // Update the state to immediately reflect the new message
      setArrivedMessages((prev) => [...prev, message]);
  
      // Reset input
      setNewMessage("");
      setImages([]);
    }
  };

  return (
    <View style={styles.container}>
      {messages || arrivedMessages &&  messages.length > 0 || arrivedMessages.length > 0 ? (
        <FlatList
          ref={scrollRef}
          data={[...messages, ...arrivedMessages]} 
          renderItem={({ item, index }) => (
            <Message key={index} messages={item} own={item.sender === UserId} />
          )}
          keyExtractor={(item, index) => item._id || index.toString()}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        />
      ) : (
        <Text style={styles.noMessages}>No messages available</Text>
      )}
      <ScrollView horizontal>
        {images.map((imageUri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <TouchableOpacity
              onPress={() => deleteImage(index)}
              style={styles.deleteButton}
            >
              <Ionicons name="close-outline" size={25} color="black" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type something..."
          style={styles.textInput}
          onChangeText={(text) => setNewMessage(text)}
          value={newMessage}
        />
        {/* <TouchableOpacity onPress={pickImage}>
          <Ionicons
            name="images-outline"
            size={30}
            color="black"
            style={styles.iconRight}
          />
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom:50,
  },
  flatListContent: {
    paddingBottom: 80,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
    bottom: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#f7b900",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    
  },
  imageContainer: {
    position: "relative",
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 5,
  },
  noMessages: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "#808080",
  },

  iconRight: {
    marginRight: 10,
    top: 8,
  },
});

export default UserChat;
