import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import styles from "./css/styles";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { getCoopProducts } from "@redux/Actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createConversation } from "@redux/Actions/converstationActions";
import { conversationList } from "@redux/Actions/converstationActions";
import { getUsers } from "@redux/Actions/userActions";
import { useSocket } from "../../../SocketIo";

const FarmerProfile = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const socket = useSocket();
  const cooperative = props.route.params.coop;
  const userItem = props.route.params.coop.user;
  const userId = context?.stateUser?.userProfile?._id;
  const { loading, coopProducts, error } = useSelector((state) => state.CoopProduct);
  const { users } = useSelector((state) => state.getThemUser);
  const { success } = useSelector((state) => state.createConversation);
  const { conversations } = useSelector((state) => state.converList);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const existConvo = conversations.find(
    (convo) =>
      convo.members.includes(cooperative.user?._id) &&
      convo.members.includes(userId)
  );
  console.log(success);
  const [token, setToken] = useState(null);
  const conversationExists = Boolean(existConvo);

  useEffect(() => {
      if (userId && token) {
        dispatch(conversationList(userId, token));
      }
    }, [userId, token, dispatch]);

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

  useFocusEffect(
    useCallback(() => {
      dispatch(getCoopProducts(cooperative.user?._id));
    }, [])
  );

  useEffect(() => {
      if (conversations && Array.isArray(conversations) && userId && token) {
        const friends = conversations.flatMap((conversation) =>
          conversation.members.filter((member) => member !== userId)
        );
  
        if (friends.length > 0) {
          dispatch(getUsers(friends, token));
        }
      }
  }, [conversations, userId, token]);
  
  useEffect(() => {
      socket.emit("addUser", userId);
  
      socket.on("getUsers", (users) => {
        const onlineUsers = users.filter(
          (user) => user.online && user.userId !== null
        );
        setOnlineUsers(onlineUsers);
      });
  
      return () => {
        socket.off("getUsers");
      };
  }, [socket, userId]);
  

  useEffect(() => {
  
      if (users && onlineUsers.length > 0) {
        const userIsOnline = users.some((user) =>
          onlineUsers.some(
            (onlineUser) =>
              onlineUser.userId === user.details._id &&
              onlineUser.online &&
              onlineUser.userId !== null
          )
        );
  
        setIsOnline(userIsOnline);
      } else {
        setIsOnline(false);
      }
  }, [users, onlineUsers]);


  const chatNow = async () => {
    const cooperativeUserId = cooperative.user?._id;
    const currentUserId = userId;

    if (context?.stateUser?.isAuthenticated) {
      try {
        if (conversationExists && existConvo) {
          navigation.navigate("ChatMessages", {
            item: userItem,
            conversations: conversations,
            isOnline: onlineUsers,
          });
        } else {
          const newConvo = {
            senderId: currentUserId,
            receiverId: cooperativeUserId,
          };

           const response = await dispatch(createConversation(newConvo, token));
           if (response) {
            setTimeout(() => {
              navigation.navigate("ChatMessages", {
                  item: userItem,
                  conversations: conversations,
                  isOnline: onlineUsers,
              });
            }, 5000);
          } else {
            console.error("Error while creating conversation");
          }
        }
      } catch (error) {
        console.error(
          "Error while creating or navigating to conversation:",
          error
        );
      }
    } else {
      navigation.navigate("RegisterScreen", { screen: "Login" });
    }
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.prodCard}>
      <TouchableOpacity
        onPress={() => navigation.navigate("SingleProduct", { item })}
      >
        {Array.isArray(item?.image) && item.image.length > 0 ? (
          <Image source={{ uri: item.image[0].url }} style={styles.prodImage} />
        ) : (
          <Text>No Image</Text>
        )}
        <Text style={styles.prodName}>{item.productName}</Text>
        <Text style={styles.prodDescription}>{item.description}</Text>
        <View style={styles.prodpriceContainer}>
          <Text style={styles.prodprice}>{item.pricing}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderProfileHeader = () => (
    <View style={styles.profileContainer}>
      {cooperative?.user?.image?.url ? (
        <Image
          source={{ uri: cooperative.user.image.url }}
          style={styles.profileImage}
        />
      ) : (
        <Image
          source={require("@assets/img/farmer.png")}
          style={styles.profileImage}
        />
      )}
      <Text style={styles.profileName}>{cooperative.farmName}</Text>
      <TouchableOpacity style={styles.editProfile} onPress={() => chatNow()}>
        <Text style={styles.editProfile}>Chat Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cooperative Profile </Text>
      </View>
      <FlatList
        ListHeaderComponent={renderProfileHeader}
        data={coopProducts}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={renderProductItem}
        numColumns={2}
        columnWrapperStyle={styles.prodrow}
        contentContainerStyle={styles.prodList}
      />
    </View>
  );
};

export default FarmerProfile;
