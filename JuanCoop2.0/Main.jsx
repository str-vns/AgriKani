import React, { useContext, useEffect, useRef, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, Alert, BackHandler, StyleSheet, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
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
import messaging from '@react-native-firebase/messaging';
import * as Notification from 'expo-notifications';

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

 const requestNotificationPermission = async () => {

  const { status: existingStatus } = await Notification.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request permission if not already granted
  if (existingStatus !== 'granted') {
    const { status } = await Notification.requestPermissionsAsync();
    finalStatus = status;
  }

  // Return true if permission is granted
  if (finalStatus === 'granted') {
    console.log("Notification permission granted.");

    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      
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
        const FCMtoken = await messaging().getToken();
        console.log("FCM Token:", FCMtoken);
      } catch (error) {
        console.error("Error getting FCM token:", error);
      }
    } else {
      console.log("No permission granted");
    }

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log("Notification caused app to open from quit state:", remoteMessage.notification);
        }
      });

    const unsubscribeOnOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("Notification caused app to open from background state:", remoteMessage.notification);
    });

    const unsubscribeBackground = messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background:", remoteMessage);
    });

    return () => {
      unsubscribeOnOpened();
      unsubscribeBackground(); 
    };
  };

  initializeFCM();
}, []);


useEffect(() => {

  const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
    console.log("Notification received while app is in the foreground:", remoteMessage.notification);

    const { title, body, android } = remoteMessage.notification;
    console.log("Title:", title);
    console.log("Body:", body);
    console.log("Image URL:", android?.imageUrl);
 Notification.scheduleNotificationAsync({
  content: {
    title: title,
    body: body,
    sound: true,
  },
  trigger: null, 
});
   
  });

  return () => {
    unsubscribeOnMessage();
    console.log("Unsubscribed from onMessage listener");
  };
}, []);



  useEffect(() => {

     const initialize = async () => {
       await context.dispatch(isLogin(context.dispatch));
       setLoading(false);
     };
 
     initialize();
   }, []);

  const handleBackPress = () => {
    const currentRoute = navigation.getCurrentRoute()?.name;
    console.log("Current Route:", navigation.getCurrentRoute());
    if (currentRoute === "Coop") { 
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
    } else {

      navigation.goBack();
      return true; 
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );

      return () => {
        backHandler.remove();
      };
    }, [navigation])
  );

  if(context.stateUser?.isLoading === false){
    <View style={styles.loaderContainer}>
     <ActivityIndicator size="large" color="#0000ff" />
     <Text>Loading...</Text>
   </View>
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
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Coop" component={CoopNavigators} />
          <Stack.Screen name="User" component={UserNavigators} />
          <Stack.Screen name="CoopProduct" component={CoopProductNavigators} />
          <Stack.Screen name="Post" component={PostNavigators} />
          <Stack.Screen name="Messaging" component={MessagesNavigators} />
          <Stack.Screen name="Blog" component={BlogNavigators} />
          <Stack.Screen name="Rider" component={RiderNavigators} />
        </Stack.Navigator>
      );
    } else if (
      context?.stateUser?.isAuthenticated &&
      UserRoles?.roles.includes("Admin")
    ) {
      return (
        <Stack.Navigator
          initialRouteName="Admin" 
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Admin" component={AdminNavigators} />
        </Stack.Navigator>
      );
    } else if (
      context?.stateUser?.isAuthenticated &&
      UserRoles?.roles.includes("Driver")
    ) {
      return (
        <Stack.Navigator
          initialRouteName="Rider" 
          screenOptions={{ headerShown: false }}
        >
           <Stack.Screen name="Rider" component={RiderNavigators} />
            <Stack.Screen name="User" component={UserNavigators} />
           
        </Stack.Navigator>
      );
    } else  {
      return (
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="Address" component={AddressNavigators} />
          <Stack.Screen name="CheckOut" component={CheckOutNavigators} />
          <Stack.Screen name="User" component={UserNavigators} />
          <Stack.Screen name="Reviews" component={ReviewsNavigators} />
          {context?.stateUser?.isAuthenticated && UserRoles?.roles.includes("Customer") &&
          UserRoles?.roles.includes("Member") && 
          ( <Stack.Screen name="Post" component={PostNavigators} />)}

          
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
