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

const Email = () => {
  const navigation = useNavigation();
  const [code, setCode] = useState(["", "", "", "", "", ""]); // Initialize 6 inputs

  const handleInputChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Automatically focus on the next input field
    if (value && index < code.length - 1) {
      const nextInput = `input${index + 1}`;
      if (refs[nextInput]) refs[nextInput].focus();
    }
  };

  const refs = {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/732/732200.png",
        }} // Replace with a local asset if needed
        style={styles.image}
      />
      <Text style={styles.subtitle}>
        Please Enter The 6 Digit Code Sent To {"\n"}
        <Text style={styles.email}>amanullah28799@gmail.com</Text>
      </Text>
      <View style={styles.codeInputContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (refs[`input${index}`] = ref)}
            value={digit}
            onChangeText={(value) => handleInputChange(value, index)}
            style={styles.codeInput}
            maxLength={1}
            keyboardType="number-pad"
          />
        ))}
      </View>
      <TouchableOpacity>
        <Text style={styles.resendCode}>Resend Code</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.verifyButton}
        onPress={() => navigation.navigate("NewPassword")}
      >
        <Text style={styles.verifyButtonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#6C6C6C",
  },
  email: {
    fontWeight: "bold",
    color: "#FFB100",
  },
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  codeInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E5E5E5",
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 5,
    backgroundColor: "#F9F9F9",
  },
  resendCode: {
    fontSize: 14,
    color: "#FFB100",
    marginBottom: 30,
    textDecorationLine: "underline",
  },
  verifyButton: {
    width: "90%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FFB100",
    alignItems: "center",
  },
  verifyButtonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default Email;
