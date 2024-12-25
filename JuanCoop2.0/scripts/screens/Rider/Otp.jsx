import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";


const Otp = () => {

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleInputChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input if value is entered
    if (value && index < otp.length - 1) {
      inputs[index + 1].focus();
    }
  };

  const inputs = [];
  const handleSubmit = () => {
    const otpCode = otp.join("");
    if (otpCode.length === 6) {
      Alert.alert("OTP Submitted", `Your OTP code is: ${otpCode}`);
    } else {
      Alert.alert("Error", "Please enter all 6 digits of the OTP.");
    }
  };
const navigation = useNavigation();
  return (
    <View style={styles.container}>


      <Text style={styles.title}>Phone verification</Text>
      <Text style={styles.subtitle}>Enter your OTP code</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            value={digit}
            onChangeText={(value) => handleInputChange(value, index)}
            keyboardType="numeric"
            maxLength={1}
            ref={(ref) => (inputs[index] = ref)}
          />
        ))}
      </View>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn’t receive code?</Text>
        <TouchableOpacity>
          <Text style={styles.resendButton}>Resend again</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.verifyButton} 
       onPress={() => navigation.navigate("Deliveries")}>
        <Text style={styles.verifyText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  backText: {
    fontSize: 16,
    color: "#666",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  otpInput: {
    width: 40, // Reduced size
    height: 40, // Reduced size
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 16, // Adjusted font size
    backgroundColor: "#f9f9f9",
    marginHorizontal: 5, // Add spacing between boxes
  },
  
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },
  resendText: {
    fontSize: 14,
    color: "#666",
  },
  resendButton: {
    fontSize: 14,
    color: "#FFC107",
    fontWeight: "bold",
    marginLeft: 5,
  },
  verifyButton: {
    backgroundColor: "#FFC107",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  verifyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Otp;
