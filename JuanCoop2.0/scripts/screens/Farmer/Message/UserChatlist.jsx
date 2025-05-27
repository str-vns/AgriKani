import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import { conversationList } from "@redux/Actions/converstationActions";
import { getUsers } from "@redux/Actions/userActions";
import { useSocket } from "@SocketIo";
import { isOnline, isUsersOnline } from "@utils/usage";
import Loader from "@shared/Loader";
import NoItem from "@shared/NoItem";
import styles from "@stylesheets/Message/UserChatList";

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
  const onlineUsers = isOnline({ userId: UserId });
  const isUserOnline = isUsersOnline({
    userId: UserId,
    onlineUsers: onlineUsers,
  });
  const [arrivedMessages, setArrivedMessages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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
        setToken(res);
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };
    fetchJwt();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (UserId && token) {
        dispatch(conversationList(UserId, token));
      }
    }, [UserId, token, dispatch])
  );

  useEffect(() => {
    if (conversations && Array.isArray(conversations) && UserId && token) {
      const friends = conversations.flatMap((conversation) =>
        conversation.members.filter((member) => member !== UserId)
      );

      if (friends.length > 0) {
        dispatch(getUsers(friends, token));
      }
    }
  }, [conversations, UserId, token]);

  const isOpenOnline = (userId) => {
    return onlineUsers.some(
      (onlineUser) => onlineUser.userId === userId && onlineUser.online
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (UserId && token) {
      await dispatch(conversationList(UserId, token));
      if (conversations && Array.isArray(conversations)) {
        const friends = conversations.flatMap((conversation) =>
          conversation.members.filter((member) => member !== UserId)
        );
        if (friends.length > 0) {
          await dispatch(getUsers(friends, token));
        }
      }
    }
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.chatItem,
        item.details._id === selectedChatId && styles.selectedChatItem,
      ]}
      onPress={() => {
        setSelectedChatId(item.details._id);
        navigation.navigate("ChatMessaging", {
          item: item.details,
          conversations: conversations,
          isOnline: onlineUsers,
        });
      }}
    >
      <View style={styles.leftContainer}>
        <View>
          {item.details?.image?.url ? (
            <View>
              <Image
                source={{ uri: item.details.image.url }}
                style={styles.profileImage}
              />
              <View
                style={
                  isOpenOnline(item.details._id)
                    ? styles.onlineIndicator
                    : styles.offlineIndicator
                }
              />
            </View>
          ) : (
            <View>
              <Image
                source={{
                  uri: "https://as2.ftcdn.net/v2/jpg/02/48/15/85/1000_F_248158543_jK3q4R8EQh0AhRtjp5n6CLXGpa0lxJvX.jpg",
                }}
                style={styles.profileImage}
              />
              <View
                style={
                  isUserOnline(item.details._id)
                    ? styles.onlineIndicator
                    : styles.offlineIndicator
                }
              />
            </View>
          )}
        </View>
        <View style={styles.chatTextContainer}>
          <Text style={styles.name}>
            {item.details?.firstName} {item.details?.lastName}
          </Text>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.time}>{item.time}</Text>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.detailsContainer}>
      <View style={styles.container}>
        {loading ? (
          <Loader />
        ) : conversations && conversations.length === 0 ? (
          <NoItem title="No Conversations" />
        ) : (
          <FlatList
          ref={scrollRef}
          data={users}
          keyExtractor={(item) => item.details._id}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
        )}
      </View>
    </View>
  );
};

export default UserChatlist;
