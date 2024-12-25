import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Location = () => {
  const [currentLocation, setCurrentLocation] = useState("2972 Westheimer Rd. Santa Ana, Illinois 85486");
  const [dropOffLocation, setDropOffLocation] = useState("1901 Thornridge Cir. Shiloh, Hawaii 81063");
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Static Image Section */}
          <View style={styles.mapImagePlaceholder}>
            <Text style={styles.mapPlaceholderText}>Map Image Placeholder</Text>
          </View>

          {/* Address Selection Section */}
          <View style={styles.bottomSheet}>
            <Text style={styles.title}>Select address</Text>

            {/* Current Location Section */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputHeader}>
                <Ionicons name="location-sharp" size={20} color="red" style={styles.icon} />
                <Text style={styles.inputTitle}>Current Location</Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={currentLocation}
                  onChangeText={setCurrentLocation}
                  placeholder="Enter current location"
                  placeholderTextColor="#999"
                  returnKeyType="done"
                />
              </View>
            </View>

            {/* Drop-off Location Section */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputHeader}>
                <Ionicons name="pin-sharp" size={20} color="green" style={styles.icon} />
                <Text style={styles.inputTitle}>Drop-off Location</Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={dropOffLocation}
                  onChangeText={setDropOffLocation}
                  placeholder="Enter drop-off location"
                  placeholderTextColor="#999"
                  returnKeyType="done"
                />
              </View>
            </View>

            {/* Confirm Location Button */}
            <TouchableOpacity style={styles.confirmButton}
             onPress={() => navigation.navigate("Dropoff")}>
              <Text style={styles.confirmButtonText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  mapImagePlaceholder: {
    width: "100%",
    height: Dimensions.get("window").height * 0.5,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  mapPlaceholderText: {
    color: "#fff",
    fontSize: 16,
  },
  bottomSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  inputHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    marginRight: 8,
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  inputContainer: {
    backgroundColor: "#f1f3f5",
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
    color: "#333",
  },
  confirmButton: {
    backgroundColor: "#FFC107",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 0, // Removed any extra space below the button
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Location;
