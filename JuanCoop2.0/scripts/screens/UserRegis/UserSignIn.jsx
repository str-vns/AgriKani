import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { loginUser } from "@redux/Actions/Auth.actions";
import Error from "@shared/Error";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSocket } from "../../../SocketIo";
import styles from "@screens/stylesheets/UserRegis/UserSignIn";
import messaging from "@react-native-firebase/messaging";
import { saveDeviceToken } from "@redux/Actions/userActions";
import { googleLogin } from "@redux/Actions/Auth.actions";
import { useDispatch, useSelector } from "react-redux";
import Constants from "expo-constants";
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: Constants?.expoConfig?.extra?.GOOGLE_LOGIN_WEB,
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  iosClientId: Constants?.expoConfig?.extra?.GOOGLE_LOGIN_IOS,  
})

const UserSignIn = () => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const context = useContext(AuthGlobal);
  const { loading, googleUser } = useSelector((state) => state.googleLogin);
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [fcmToken, setFcmToken] = useState("");
  const [error, setError] = useState("");
  const [userInfos, setUserInfos] = useState("");
  const userInfo = context?.stateUser?.user?.CustomerInfo;
  const user = context?.stateUser?.userProfile;

  useEffect(() => {

    if (!user?._id) {
      // console.warn("User ID is missing.");
      return; 
    }
  
    if (!socket) {
      console.warn("Socket is not initialized.");
      return; 
    }
  
    socket.emit("addUser", user._id);
  
    socket.on("getUsers", (users) => {
      const onlineUsers = users.filter(
        (user) => user.online && user.userId !== null
      );
  
      setOnlineUsers(onlineUsers);
    });
  
    return () => {
      socket.off("getUsers");
    };
  }, [socket, user?._id]);


  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  };

  useEffect(() => {
    if (requestUserPermission()) {
      messaging()
        .getToken()
        .then((token) => {
          setFcmToken(token);
        });
    } else {
      console.log("No permission granted", authStatus);
    }

    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
        }
      });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification
      );
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background:", remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  console.log("User Info: ",context?.stateUser?.userProfile );
  useEffect(() => {
    if (
      context?.stateUser?.isAuthenticated &&
      userInfo?.roles &&
      userInfo.roles.includes("Customer") &&
      userInfo.roles.includes("Cooperative")
    ) {
      const saveDtoken = {
        email: email || googleUser?.user?.email ,
        deviceToken: fcmToken,
      };

      dispatch(saveDeviceToken(saveDtoken));
      setEmail("");
      setPassword("");
      setError("");
      setIsLoading(false);
      navigation.navigate("CoopDashboard");
    } else if (
      context?.stateUser?.isAuthenticated &&
      userInfo?.roles &&
      userInfo.roles.includes("Admin")
    ) {
      const saveDtoken = {
        email: email || googleUser?.user?.email,
        deviceToken: fcmToken,
      };

      dispatch(saveDeviceToken(saveDtoken));
      setEmail("");
      setPassword("");
      setError("");
      setIsLoading(false);
      console.log("Navigating to Admin Dashboard");
      navigation.navigate("Admin");
    } else if (
      context?.stateUser?.isAuthenticated &&
      userInfo.roles.includes("Customer")
    ) {
      const saveDtoken = {
        email: email || googleUser?.user?.email,
        deviceToken: fcmToken,
      };

      dispatch(saveDeviceToken(saveDtoken));
      setEmail("");
      setPassword("");
      setError("");
      setIsLoading(false);
      console.log("Navigating to Home");
      navigation.navigate("Home", { screen: "Home" });
    } else if (
      context?.stateUser?.isAuthenticated &&
      userInfo.roles.includes("Driver")
    ) {
      const saveDtoken = {
        email: email || googleUser?.user?.email,
        deviceToken: fcmToken,
      };

      dispatch(saveDeviceToken(saveDtoken));
      setEmail("");
      setPassword("");
      setError("");
      setIsLoading(false);
      console.log("Navigating to Home");
      navigation.navigate("Deliveries");
    }
  }, [context?.stateUser?.isAuthenticated, googleUser?.user?.email,]);
  

  const handleSubmit = async() => {
    setIsLoading(true);
    try {
      if (email === "" || password === "") {
        setIsLoading(false);
        setError("Please fill in the required fields");
      } else if (!email || !email.includes("@")) {
        setIsLoading(false);
        setError("Please provide a valid email address.");
      } else {
        const user = { email, password };
       const loginwork = await loginUser(user, context.dispatch);
        console.log("Login work: ", loginwork);
       if(loginwork === false){
        setError( "Invalid email or password");
       }
        setIsLoading(false);
      } 
    }catch(error){
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllStorage = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        console.log("Keys: ", keys);

        const stores = await AsyncStorage.multiGet(keys);
        stores.forEach((result) => {
          const key = result[0];
          const value = result[1];
          console.log(key, value);
        });
      } catch (error) {
        console.error("Error retrieving data from AsyncStorage:", error);
      }
    };

    fetchAllStorage();
  }, []);


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>JuanCoop</Text>

        <Image source={require("@assets/img/logo.png")} style={styles.logo} />

        <Text style={styles.subtitle}>Login to your account</Text>
        <Text style={styles.instructions}>Welcome to JuanCoop</Text>

        <TextInput
          placeholder="Enter your Email"
          placeholderTextColor="#ccc"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          name="email"
          id="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        {/* Password input with eye icon */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#ccc"
            style={styles.passwordInput}
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!isPasswordVisible)}
          >
            <Icon
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color="#777"
            />
          </TouchableOpacity>
        </View>
    

        <Text
    style={[styles.linkText, styles.rightAlign]}
    onPress={() => navigation.navigate("ForgotPass")}
  >
    forgot Password?
  </Text>
        
        {error ? <Error message={error} /> : null}
        <TouchableOpacity
          style={styles.buttonEmail}
          onPress={() => handleSubmit()}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.line} />
        </View>
{/* 
        <TouchableOpacity style={styles.buttonGoogle} onPress={() => promptAsync()}>
          <Image
            source={{
              uri: "https://freelogopng.com/images/all_img/1657952217google-logo-png.png",
            }}
            style={styles.googleLogo}
          />
          <Text style={styles.buttonText}></Text>
        </TouchableOpacity> */}
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={() => googleLogin(context.dispatch)}
        />
        
        <Text style={styles.agreement}>
          Don’t have an account?{" "}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate("Register")}
          >
            Sign Up
          </Text>
        </Text>
        {/* <Text style={styles.agreement}>
          <Text
            style={styles.linkText}
            // onPress={() => navigation.navigate("Register")}
          >
            Forgot Your Password?
          </Text>
        </Text> */}
      </View>
    </ScrollView>
  );
};

export default UserSignIn;
