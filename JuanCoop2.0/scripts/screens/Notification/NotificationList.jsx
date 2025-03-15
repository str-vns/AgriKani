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

const NotificationList = ({ navigation }) => {
  const navigate = useNavigation()
  const dispatch = useDispatch()
  const context = useContext(AuthGlobal);
  const userId = context.stateUser?.userProfile?._id;
  const roles = context.stateUser?.userProfile?.roles; 
  const userRole = roles?.includes("Cooperative") && roles?.includes("Customer") ? styles.containerCooP : styles.container;
  const { notifloading, notification, notiferror } = useSelector((state) => state.getNotif);
  const [token, setToken] = useState(null);
  const [refresh, setRefresh] = useState(false);

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

  const handleRead = async(id, type) => {

    try {
      dispatch(readNotification(id, token));
      if (type === "order")
      {
        navigate.navigate("User", { screen: "UserOrderList" });
    
      } else if (type === "message") {
        navigation.navigate("Home", { screen: "Messages" })
      }
      
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
      onPress={() => handleRead(item._id, item.type)}
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
            <Text style={styles.notificationHeader} numberOfLines={1} ellipsizeMode="tail" >{item.title}</Text>
           <Text style={styles.timestamp}>{moment(item?.createdAt).fromNow()}</Text>
           </View>
            <Text style={styles.notificationLine}>{item.content}</Text>
          </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={userRole}>
      {/* <View style={styles.header}>
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => navigation.toggleDrawer()}
        >
          <Ionicons name="menu" size={34} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notificmmmation</Text>
      </View> */}
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
      <Text style={styles.noOrdersText}>No Notification found.</Text>
    )}
  </View>
)}
    </View>
  );
};

export default NotificationList;
