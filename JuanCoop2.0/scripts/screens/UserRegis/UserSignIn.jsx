import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { loginUser } from "@redux/Actions/Auth.actions";
import Error from "@shared/Error";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSocket } from "../../../SocketIo";
import styles from "@screens/stylesheets/UserRegis/UserSignIn";

const UserSignIn = () => {
  const socket = useSocket();
  const context = useContext(AuthGlobal);
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const userInfo = context?.stateUser?.user?.CustomerInfo;
  const user = context?.stateUser?.userProfile;

  useEffect(() => {
    socket.emit("addUser", user?._id);

    socket.on("getUsers", (users) => {
      const onlineUsers = users.filter(
        (user) => user.online && user.userId !== null
      );
      console.log("Filtered online users:", onlineUsers);

      setOnlineUsers(onlineUsers);
    });

    return () => {
      socket.off("getUsers");
    };
  }, [socket, user?._id]);

  useEffect(() => {
    if (
      context?.stateUser?.isAuthenticated &&
      userInfo?.roles &&
      userInfo.roles.includes("Customer") &&
      userInfo.roles.includes("Cooperative")
    ) {
      console.log("Navigating to Dashboard");
      navigation.navigate("CoopDashboard");
      setEmail("");
      setPassword("");
      setError("");
    } else if (
      context?.stateUser?.isAuthenticated &&
      userInfo?.roles &&
      userInfo.roles.includes("Admin")
    ) {
      console.log("Navigating to Admin Dashboard");
      navigation.navigate("Admin");
      setEmail("");
      setPassword("");
      setError("");
    } else if (context?.stateUser?.isAuthenticated) {
      console.log("Navigating to Home");
      navigation.navigate("Home", { screen: "Home" });
      setEmail("");
      setPassword("");
      setError("");
    }
  }, [context.stateUser.isAuthenticated]);

  const handleSubmit = () => {
    // Check if email or password is empty
    if (email === "" || password === "") {
      setError("Please fill in the required fields");
    } else {
      const user = { email, password };
      loginUser(user, context.dispatch);
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
    <View style={styles.container}>
      <Text style={styles.title}>AgriKaani</Text>

      <Image source={require("@assets/img/logo.png")} style={styles.logo} />

      <Text style={styles.subtitle}>Login to your account</Text>
      <Text style={styles.instructions}>Welcome to AgriKaani</Text>

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
      {/* <Text style={styles.agreement}>
        Forgot Password?{" "}
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate("Registration")}
        >
          Click here
        </Text>
      </Text>
       */}
      {error ? <Error message={error} /> : null}
      <TouchableOpacity
        style={styles.buttonEmail}
        onPress={() => handleSubmit()}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>or continue with</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={styles.buttonGoogle}>
        <Image
          source={{
            uri: "https://freelogopng.com/images/all_img/1657952217google-logo-png.png",
          }}
          style={styles.googleLogo}
        />
        <Text style={styles.buttonText}></Text>
      </TouchableOpacity>

      <Text style={styles.agreement}>
        Don’t have an account?{" "}
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate("Register")}
        >
          Sign Up
        </Text>
      </Text>

      <Text style={styles.agreement}>
        <Text
          style={styles.linkText}
          // onPress={() => navigation.navigate("Register")}
        >
          Forgot Your Password?
        </Text>
      </Text>
    </View>
  );
};

export default UserSignIn;
