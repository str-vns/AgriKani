import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Register = () => {
    const navigation = useNavigation();
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    street: "",
    city: "",
    password: "",
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      phoneNumber: "",
      email: "",
      street: "",
      city: "",
      password: "",
    });
  };

  const handleSave = () => {
    Alert.alert("Saved Data", JSON.stringify(formData, null, 2));
  };

  return (
    
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>

       
        {/* Profile Picture */}
        <View style={styles.profileContainer}>
          <View style={styles.profileImage}></View>
          <TouchableOpacity>
            <Text style={styles.uploadText}>Upload Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={formData.fullName}
            onChangeText={(value) => handleInputChange("fullName", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="numeric"
            value={formData.phoneNumber}
            onChangeText={(value) => handleInputChange("phoneNumber", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Street"
            value={formData.street}
            onChangeText={(value) => handleInputChange("street", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            value={formData.city}
            onChangeText={(value) => handleInputChange("city", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Your Password"
            secureTextEntry
            value={formData.password}
            onChangeText={(value) => handleInputChange("password", value)}
          />
        </View>
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} 
        onPress={() => navigation.navigate("Otp")}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Ensures scrollable content doesn't overlap buttons
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  backText: {
    fontSize: 16,
    color: "#007bff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ddd",
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 16,
    color: "#007bff",
  },
  form: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#f39c12",
    borderRadius: 5,
    padding: 10,
    flex: 0.45,
  },
  cancelText: {
    textAlign: "center",
    color: "#f39c12",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#f39c12",
    borderRadius: 5,
    padding: 10,
    flex: 0.45,
  },
  saveText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
  },
});

export default Register;
