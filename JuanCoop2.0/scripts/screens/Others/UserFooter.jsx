import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  NativeBaseProvider,
  Box,
  Center,
  Text,
  HStack,
  Pressable,
  Icon,
  View,
} from "native-base";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AuthGlobal from "@redux/Store/AuthGlobal";
import styles from "@screens/stylesheets/others/notif";
import { useSocket } from "../../../SocketIo"
import { useDispatch, useSelector } from "react-redux";
import { singleNotification } from "@redux/Actions/notificationActions";
import AsyncStorage from "@react-native-async-storage/async-storage";


const UserFooter = () => {
  const { notifloading, notification, notiferror } = useSelector((state) => state.getNotif);
  const dispatch = useDispatch();
  const context = useContext(AuthGlobal);
  const navigation = useNavigation();
  const socket = useSocket();

  const userId = context.stateUser?.userProfile?._id;
  const [selected, setSelected] = useState(1);
  const [notif, setNotif] = useState([]);
  const [token, setToken] = useState(null);

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

  useEffect(() => {
    if (socket) {
      socket.on("getNotification", (data) => {
        setNotif((prev) => [...prev, data]);
      });
  
      return () => {
        socket.off('getNotification');
      };
    }
  }, [socket]);
  
 useFocusEffect(
    useCallback(() => {
      dispatch(singleNotification(userId, token));
      setNotif([]);
    }, [dispatch, token])
  );

  const numNotif = notification.filter((notif) => notif.readAt === null).length;
  const overallNotif = Number(numNotif) + notif.length;

  console.log("notif", overallNotif);
  const handleMessage = () => {
    {
      context?.stateUser?.isAuthenticated
        ? navigation.navigate("Home", { screen: "Messages" })
        : navigation.navigate("RegisterScreen", { screen: "Login" });
    }
  };
  const handleWish = () => {
    {
      context?.stateUser?.isAuthenticated
        ? navigation.navigate("Home", { screen: "Wishlist" })
        : navigation.navigate("RegisterScreen", { screen: "Login" });
    }
  };

 const notifNavigate = () => {
    setNotif([]);
    navigation.navigate("Home", { screen: "NotificationList" });
};

const handleNotif = () => {
    if (context?.stateUser?.isAuthenticated) {
        notifNavigate();
    } else {
        navigation.navigate("RegisterScreen", { screen: "Login" });
    }
};

  return (
    <Box width="100%" alignSelf="center" flexDirection="column">
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        bg="white"
        safeAreaBottom
        shadow={6}
        borderTopRadius="20"
        px="4"
      >
        <HStack alignItems="center" justifyContent="space-between">
          <Pressable
            cursor="pointer"
            opacity={selected === 1 ? 1 : 0.5}
            py="2"
            flex={1}
            onPress={() => {
              setSelected(1);
              navigation.navigate("Home", { screen: "ProductContainer" });
            }}
          >
            <Center>
              <Icon
                mb="1"
                as={<MaterialIcons name="home" />}
                color={selected === 1 ? "#f7b900" : "gray.400"}
                size="lg"
              />
              <Text
                color={selected === 1 ? "#f7b900" : "gray.400"}
                fontSize="12"
              >
                Home
              </Text>
            </Center>
          </Pressable>

          <Pressable
            cursor="pointer"
            opacity={selected === 0 ? 1 : 0.5}
            py="2"
            flex={1}
            onPress={() => handleNotif()}
          >
            <Center>
          {(numNotif > 0 || notif.length > 0) && (
  <View style={styles.notifCircle}>
    <Text style={styles.text}>{overallNotif}</Text>
  </View>
)}
              <Icon
                mb="1"
                as={
                  <MaterialCommunityIcons
                    name={selected === 0 ? "bell" : "bell-outline"}
                  />
                }
                color={selected === 0 ? "#f7b900" : "gray.400"}
                size="lg"
              />
              <Text
                color={selected === 0 ? "#f7b900" : "gray.400"}
                fontSize="12"
              >
                Notification
              </Text>
            </Center>
          </Pressable>

          <Pressable
            cursor="pointer"
            onPress={() => {
              setSelected(2);
              navigation.navigate("Home", { screen: "Cart" });
            }}
            p="4"
            bg="#f7b900"
            borderRadius="full"
            alignItems="center"
          >
            <Center>
              <Icon
                mb="1"
                as={
                  <MaterialCommunityIcons
                    name={selected === 2 ? "cart" : "cart-outline"}
                  />
                }
                color="white"
                size="xl"
              />
            </Center>
          </Pressable>

          <Pressable
            cursor="pointer"
            opacity={selected === 3 ? 1 : 0.5}
            py="2"
            flex={1}
            onPress={() => handleWish()}
          >
            <Center>
              <Icon
                mb="1"
                as={
                  <MaterialCommunityIcons
                    name={selected === 3 ? "heart" : "heart-outline"}
                  />
                }
                color={selected === 3 ? "#f7b900" : "gray.400"}
                size="lg"
              />
              <Text
                color={selected === 3 ? "#f7b900" : "gray.400"}
                fontSize="12"
              >
                Wishlist
              </Text>
            </Center>
          </Pressable>

          <Pressable
            cursor="pointer"
            opacity={selected === 4 ? 1 : 0.5}
            py="2"
            flex={1}
            onPress={() => handleMessage()}
          >
            <Center>
              <Icon
                mb="1"
                as={
                  <MaterialCommunityIcons
                    name={selected === 4 ? "chat" : "chat-outline"}
                  />
                }
                color={selected === 4 ? "#f7b900" : "gray.400"}
                size="lg"
              />
              <Text
                color={selected === 4 ? "#f7b900" : "gray.400"}
                fontSize="12"
              >
                Messages
              </Text>
            </Center>
          </Pressable>
        </HStack>
      </Box>
    </Box>
  );
};

export default UserFooter;
