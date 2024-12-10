import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // For icons
import { Card } from "react-native-elements"; // For the address card styling
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import Stepper from "../../../components/status";

const { width } = Dimensions.get("window");

const UserAddressSelectionScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState(null); // State to track selected card index

  const toggleSelection = (index) => {
    setSelectedIndex(index); // Update state to reflect the selected card
  };

  const navigation = useNavigation(); 

  // Initial region for the map (centered in Bulacan, Philippines)
  const [region, setRegion] = useState({
    latitude: 14.8535,
    longitude: 120.816,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Function to handle region change (when user moves the map)
  const onRegionChange = (newRegion) => {
    setRegion(newRegion);
  };

  return (
    <View style={styles.container}>
       <View style={styles.stepperContainer}>
        <Stepper currentStep={1} />
      </View>
      {/* Map View */}
   

      {/* Bottom Sheet for Address */}
      <View style={styles.bottomSheet}>
        <Text style={styles.instructionText}>
          Move pin to set your exact location
        </Text>

        {/* Address Card */}
        <Card containerStyle={styles.addressCard}>
          <View style={styles.addressDetails}>
            <Text style={styles.addressTitle}>Bulacan</Text>
            <Text style={styles.addressText}>
              Jiva sector 21B, Block B, Industrial area, Bulacan - 3000
            </Text>
          </View>
        </Card>

        {/* Confirm Button */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => navigation.navigate("UserAddressFormScreen")}
        >
          <Text style={styles.confirmButtonText}>Confirm and add details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  instructionText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  addressDetails: {
    marginLeft: 10,
    flex: 1,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addressText: {
    fontSize: 14,
    color: "#666",
  },
  confirmButton: {
    backgroundColor: "#f7b900",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    width: width - 40,
    alignSelf: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UserAddressSelectionScreen;