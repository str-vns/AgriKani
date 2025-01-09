import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { OTPregister } from "@redux/Actions/userActions";

const ForgotPass = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const handleSend = () => {
    if (email) {
      dispatch(OTPregister({ email }));
      alert(`Verification code sent to ${email}`);
      navigation.navigate("Email", { email });
    } else {
      alert("Please enter your email address.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/3064/3064197.png",
        }} // Replace with your desired lock icon URL
        style={styles.icon}
      />
      <Text style={styles.instructions}>
        Please Enter Your Email Address To {"\n"} Receive a Verification Code.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#A0A0A0"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity
        style={styles.sendButton}
        onPress={() => handleSend()}
      >
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    textAlign: "center",
    color: "#6C6C6C",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
    color: "#000",
  },
  tryAnotherWay: {
    fontSize: 14,
    color: "#FF4500",
    textDecorationLine: "underline",
    marginBottom: 30,
  },
  sendButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFB100",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default ForgotPass;
