import React, { useContext, useEffect, useRef, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  StyleSheet,
  View,
} from "react-native";
import { useNavigationState, useNavigation } from "@react-navigation/native";
import HomeScreen from "@navigators/Home";
import RegisterScreen from "@navigators/SignInNavigators";
import ReviewsNavigators from "@navigators/ReviewsNavigators";
import AdminNavigators from "@navigators/AdminNavigators";
import AddressNavigators from "@navigators/AddressNavigators";
import PostNavigators from "@navigators/PostNavigators";
import CoopNavigators from "@navigators/CoopNavigators";
import CheckOutNavigators from "@navigators/CheckOutNavigators";
import UserNavigators from "@navigators/UserNavigators";
import CoopProductNavigators from "@navigators/CoopProductNavigators";
import MessagesNavigators from "@navigators/MessagesNavigators";
import BlogNavigators from "@navigators/BlogNavigators";
import RiderNavigators from "@navigators/RiderNavigators";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { isLogin } from "@redux/Actions/Auth.actions";
import { Text } from "native-base";
import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  setBackgroundMessageHandler,
  requestPermission,
  AuthorizationStatus,
} from "@react-native-firebase/messaging";
import * as Notification from "expo-notifications";
import Landing from "@screens/User/Landing";
import { DrawerDesign, BackButton } from "@shared/DrawerDesign";
import notifee, {
  AndroidStyle,
  AndroidImportance,
} from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

Notification.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Main = () => {
  const context = useContext(AuthGlobal);
  const navigation = useNavigation();
  const UserRoles = context?.stateUser?.userProfile || null;
  const [loading, setLoading] = useState(true);
  const routes = useNavigationState((state) => state.routes);
  const currentRoute = routes[routes.length - 1]?.name;
  const app = getApp();
  const messaging = getMessaging(app);

  const requestNotificationPermission = async () => {
    const { status: existingStatus } = await Notification.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notification.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus === "granted") {
      console.log("Notification permission granted.");

      try {
        const authStatus = await requestPermission(messaging);
        const enabled =
          authStatus === AuthorizationStatus.AUTHORIZED ||
          authStatus === AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log("Authorization status:", authStatus);
        } else {
          console.log("Permission not granted");
        }
        return enabled;
      } catch (error) {
        console.error("Error requesting permission:", error);
        return false;
      }
    } else {
      console.log("Notification permission denied.");
      return false;
    }
  };

  useEffect(() => {
    const initializeFCM = async () => {
      const permissionGranted = await requestNotificationPermission();
      if (permissionGranted) {
        try {
          const FCMtoken = await getToken(messaging);
          if (FCMtoken) {
            console.log("FCM Token:", FCMtoken);
            await AsyncStorage.setItem("fcmToken", FCMtoken);
          } else {
            console.log("No FCM token received");
          }
        } catch (error) {
          console.error("Error getting FCM token:", error);
        }
      } else {
        console.log("No permission granted");
      }

      getInitialNotification(messaging).then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
        }
      });

      const unsubscribeOnOpened = onNotificationOpenedApp(
        messaging,
        (remoteMessage) => {
          console.log(
            "Notification caused app to open from background state:",
            remoteMessage.notification
          );
        }
      );

      const unsubscribeBackground = setBackgroundMessageHandler(
        messaging,
        async (remoteMessage) => {
          console.log(
            "Notification caused app to open from background state:",
            remoteMessage.notification
          );
        }
      );

      return () => {
        unsubscribeOnOpened();
        unsubscribeBackground();
      };
    };

    initializeFCM();
  }, []);

  useEffect(() => {
    async function createChannel() {
      await notifee.createChannel({
        id: "default",
        name: "Default Channel",
        importance: AndroidImportance.HIGH,
      });
    }

    createChannel();
  }, []);

  useEffect(() => {
    const unsubscribeOnMessage = onMessage(messaging, onMessageReceived);

    return () => {
      unsubscribeOnMessage();
      console.log("Unsubscribed from onMessage listener");
    };
  }, []);

  function onMessageReceived(message) {
    if (!message.data || (!message.data.title && !message.data.body)) {
      // Don't show notification if no useful data
      console.log("No notification data, skipping display.");
      return;
    }

    const { title, body, imageUrl, type } = message.data;
    console.log("Received message:", message);
    if (type !== "cancelled") {
      const validImage =
        typeof imageUrl === "string" && imageUrl.startsWith("http")
          ? imageUrl
          : "https://your-default-image-url.com/default.png";

      notifee.displayNotification({
        title: title || "Notification",
        body: body || "",
        android: {
          channelId: "default",
          smallIcon: "ic_launcher",
          showTimestamp: true,
          largeIcon: validImage,
          importance: AndroidImportance.HIGH,
          vibration: true,
          style: {
            type: AndroidStyle.BIGPICTURE,
            picture: validImage,
          },
          pressAction: {
            id: "default",
          },
        },
      });
    } else {
      notifee.displayNotification({
        title: title || "Notification",
        body: body || "",
        android: {
          channelId: "default",
          smallIcon: "ic_launcher",
          showTimestamp: true,
          importance: AndroidImportance.HIGH,
          vibration: true,
          style: {
            type: AndroidStyle.BIGTEXT,
            text: body || "",
          },
          pressAction: {
            id: "default",
          },
        },
      });
    }
  }

  useEffect(() => {
    const initialize = async () => {
      await context.dispatch(isLogin(context.dispatch));
      setLoading(false);
    };

    initialize();
  }, []);

  const handleBackPress = () => {
    console.log("Current Route Name:", currentRoute);

    if (currentRoute === "Coop") {
      return true;
    } else if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    } else {
      Alert.alert("Exit App", "Exiting the application?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "Ok",
          onPress: () => BackHandler.exitApp(),
        },
      ]);

      return true;
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );
    return () => backHandler.remove();
  }, [currentRoute]);

  if (context.stateUser?.isLoading === false) {
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading...</Text>
    </View>;
  }

  const renderStackNavigator = () => {
    if (
      context?.stateUser?.isAuthenticated &&
      UserRoles?.roles.includes("Customer") &&
      UserRoles?.roles.includes("Cooperative")
    ) {
      return (
        <Stack.Navigator
          initialRouteName="Coop"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        >
          <Stack.Screen
            name="Coop"
            component={CoopNavigators}
            options={{
              headerShown: false,
              tabBarShowLabel: false,
            }}
          />
          <Stack.Screen
            name="User"
            component={UserNavigators}
            options={{
              headerShown: false,
              tabBarShowLabel: false,
            }}
          />
          <Stack.Screen
            name="CoopProduct"
            component={CoopProductNavigators}
            options={{
              headerShown: false,
              tabBarShowLabel: false,
            }}
          />
          <Stack.Screen
            name="Post"
            component={PostNavigators}
            options={{
              headerShown: false,
              tabBarShowLabel: false,
            }}
          />
          <Stack.Screen
            name="Messaging"
            component={MessagesNavigators}
            options={{
              headerShown: false,
              tabBarShowLabel: false,
            }}
          />
          <Stack.Screen
            name="Blog"
            component={BlogNavigators}
            options={{
              headerShown: false,
              tabBarShowLabel: false,
            }}
          />
          <Stack.Screen
            name="Rider"
            component={RiderNavigators}
            options={{
              headerShown: false,
              tabBarShowLabel: false,
            }}
          />
        </Stack.Navigator>
      );
    } else if (
      context?.stateUser?.isAuthenticated &&
      UserRoles?.roles.includes("Admin")
    ) {
      return (
        <Stack.Navigator
          initialRouteName="Admin"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        >
          <Stack.Screen
            name="Admin"
            component={AdminNavigators}
            options={{
              headerShown: false,
              tabBarShowLabel: false,
            }}
          />
        </Stack.Navigator>
      );
    } else if (
      context?.stateUser?.isAuthenticated &&
      UserRoles?.roles.includes("Driver")
    ) {
      return (
        <Stack.Navigator
          initialRouteName="Rider"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        >
          <Stack.Screen
            name="Rider"
            component={RiderNavigators}
            options={{
              headerShown: false,
              tabBarShowLabel: false,
            }}
          />
          <Stack.Screen
            name="User"
            component={UserNavigators}
            options={{
              headerShown: false,
              tabBarShowLabel: false,
            }}
          />
        </Stack.Navigator>
      );
    } else {
      return (
        <Stack.Navigator
          initialRouteName="Landing"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        >
          <Stack.Screen
            name="Landing"
            component={Landing}
            options={{
              header: (props) => (
                <DrawerDesign
                  {...props}
                  title={`Hi, ${
                    context?.stateUser?.userProfile?.firstName || "Guest"
                  }`}
                />
              ),
            }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: false,
              tabBarShowLabel: false,
            }}
          />
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{
              headerShown: false,
              tabBarShowLabel: false,
            }}
          />
          <Stack.Screen
            name="Address"
            component={AddressNavigators}
            options={{
              headerShown: false,
              tabBarShowLabel: false,
            }}
          />
          <Stack.Screen
            name="CheckOut"
            component={CheckOutNavigators}
            options={{
              headerShown: false,
              tabBarShowLabel: false,
            }}
          />
          <Stack.Screen
            name="User"
            component={UserNavigators}
            options={{
              headerShown: false,
              tabBarShowLabel: false,
            }}
          />
          <Stack.Screen
            name="Reviews"
            component={ReviewsNavigators}
            options={{
              headerShown: false,
              tabBarShowLabel: false,
            }}
          />
          {context?.stateUser?.isAuthenticated &&
            UserRoles?.roles.includes("Customer") &&
            UserRoles?.roles.includes("Member") && (
              <Stack.Screen
                name="Post"
                component={PostNavigators}
                options={{
                  headerShown: false,
                  tabBarShowLabel: false,
                }}
              />
            )}
        </Stack.Navigator>
      );
    }
  };

  return <>{renderStackNavigator()}</>;
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});
export default Main;
