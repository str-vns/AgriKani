import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { singleNotification, readAllNotifications, readNotification } from "@redux/Actions/notificationActions";
import styles from "../stylesheets/Notification/NotificationList";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "@redux/Store/AuthGlobal";
import moment from 'moment';

const data = [
  {
    title: "Amazing Sunset",
    content:
      "A beautiful view of the sunset over the mountains, with vibrant colors filling the sky.",
      time: "2 hours ago",
  },
  {
    title: "City Skyline",
    content:
      "The stunning skyline of a modern city at night, illuminated by countless lights.",
      time: "2 hours ago",
  },
  {
    title: "Ocean Waves",
    content:
      "Waves crashing on a beach during a bright sunny day, with the ocean stretching to the horizon.",
      time: "2 hours ago",
  },
  {
    title: "Forest Path",
    content:
      "A serene and tranquil forest path, surrounded by tall trees and a lush green landscape.",
      time: "2 hours ago",
  },
  {
    title: "Snowy Mountain",
    content:
      "A majestic mountain covered in snow, with a clear blue sky and a peaceful atmosphere.",
    time: "2 hours ago",
  },
];

const NotificationList = ({ navigation }) => {
  const navigate = useNavigation()
  const dispatch = useDispatch()
  const context = useContext(AuthGlobal);
  const userId = context.stateUser.userProfile?._id;
  const { notifloading, notification, notiferror } = useSelector((state) => state.getNotif);
  const [token, setToken] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const time = moment(notification?.createdAt).fromNow();

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
      dispatch(singleNotification(userId, token));
    }, [dispatch, token])
  );

 
  const onRefresh = useCallback(async () => {
    setRefresh(true);
  
      setTimeout(() => {
        dispatch(singleNotification(userId, token));
        setRefresh(false);
      }, 500);
  
  }, [userId, token, dispatch]);

  const handleRead = async(id) => {
    try {
      dispatch(readNotification(id, token));
      navigate.navigate("User", { screen: "UserOrderList" });
      onRefresh()
    } catch (error) {
      console.error("Error marking as read: ", error);
    }
  };

  const handleReadAll = async() => {
    try{
      dispatch(readAllNotifications(userId, token));
      onRefresh()
    }catch (error) {
      console.error("Error marking all as read: ", error);
    }
  };

  const renderOrder = ({ item }) => {
    return (
      <View style={styles.notificationsContainer}>
         <TouchableOpacity
      style={[styles.notificationSection, item.readAt !== null ? styles.readNotification : styles.unreadNotification]}
      onPress={() => handleRead(item._id)}
    >
          <View style={styles.notifDetails}>
          <View style={styles.notifImageContainer}>
          {item.url && (
  <Image
    source={{ uri: item.url }}
    style={styles.notifImage}
  />
)}
            </View>
            <View style={styles.notifTextContainer}>
            <View style={styles.notifHeaderContainer}>
            <Text style={styles.notificationHeader}>{item.title}</Text>
           <Text style={styles.timestamp}>{time}</Text>
           </View>
            <Text style={styles.notificationLine}>{item.content}</Text>
          </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => navigation.toggleDrawer()}
        >
          <Ionicons name="menu" size={34} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notification</Text>
      </View>
      <TouchableOpacity
      onPress={() => handleReadAll()}
    >
      <Text style={styles.ReadAllText}>Mark All as Read</Text>
    </TouchableOpacity>

      {notifloading ? (
  <ActivityIndicator size="large" color="#0000ff" />
) : (
  <View>
    {notification ? (
      <FlatList
        data={notification}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderOrder}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    ) : (
      <Text style={styles.noOrdersText}>No orders found.</Text>
    )}
  </View>
)}
    </View>
  );
};

export default NotificationList;
