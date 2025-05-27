import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
} from "react-native";
import Message from "./UserMessage";
import { useSelector, useDispatch } from "react-redux";
import { useSocket } from "../../../../SocketIo";
import { listMessages, sendingMessage } from "@redux/Actions/messageActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "@redux/Store/AuthGlobal";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { sendNotifications } from "@redux/Actions/notificationActions";
import messaging from "@react-native-firebase/messaging";
import styles from "@stylesheets/Message/UserChat"; 
import Loader from "@shared/Loader";
import NoItem from "@shared/NoItem";

const UserChat = (props) => {
  const { item, conversations, isOnline } = props.route.params;
  const dispatch = useDispatch();
  const socket = useSocket();
  const scrollRef = useRef(null);
  const context = useContext(AuthGlobal);
  const UserId = context?.stateUser?.userProfile?._id;
  const { loading, messages, error } = useSelector((state) => state.getMessages);
  const [token, setToken] = useState(null);
  const [arrivedMessages, setArrivedMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [images, setImages] = useState([]);
  const [fcmToken, setFcmToken] = useState("");
  const validConversations = Array.isArray(conversations) ? conversations : [];
  console.log("validConversations", conversations);
  const myConvo = validConversations.find((convo) =>
    convo.members.includes(item?._id)
  );

  const isOnlinerUser = isOnline.find((user) => user.userId === item?._id);

  console.log("isOnlinerUser", isOnlinerUser);
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
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollToEnd({ animated: true });
      }
    }, 100); // Adjust delay as needed
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

  const sendMessage = () => {
    if (!myConvo) {
      console.error("Conversation not found or item is undefined.");
      return;
    }
  
    if (newMessage.trim() || images.length) {
      const message = {
        sender: UserId,
        text: newMessage,
        conversationId: myConvo._id,
        image: images,
      };
  
      socket.emit("sendMessage", {
        senderId: UserId,
        receiverId: myConvo.members.find((member) => member !== UserId),
        text: newMessage,
        image: images,
      });
  
      if (!isOnlinerUser) {
        const notification = {
          title: `New message`,
          content: `You have a new message from ${context?.stateUser?.userProfile?.firstName} ${context?.stateUser?.userProfile?.lastName}`,
          user: item?._id,
          url: item?.image?.url || "",
          fcmToken: fcmToken,
          type: "message",
        };
        dispatch(sendNotifications(notification, token));
      }
  
      dispatch(sendingMessage(message, token));
      setNewMessage("");
      setImages([]);
      setArrivedMessages((prev) => [...prev, message]);
    }
  };

  return (
    <View style={styles.container}>
      <>
        { loading ? ( 
          <Loader />
        )  : error ? (
          <NoItem title="Conversation" />
        ) : arrivedMessages.length === 0 && messages.length === 0 ? (
          <NoItem title="Conversation" />
        ) : (messages || (arrivedMessages && messages.length > 0) || arrivedMessages.length > 0 ? (
          <FlatList
            ref={scrollRef}
            data={[...messages, ...arrivedMessages]}
            renderItem={({ item, index }) => (
              <Message key={index} messages={item} own={item.sender === UserId} />
            )}
            keyExtractor={(item, index) => item._id || index.toString()}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollToEnd({ animated: true });
              }
            }}
          />) : (<NoItem title="Conversation" />)
        )}

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type something..."
            style={styles.textInput}
            onChangeText={(text) => setNewMessage(text)}
            value={newMessage}
            multiline
          />

          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </>
    </View>
  );
};

export default UserChat;
