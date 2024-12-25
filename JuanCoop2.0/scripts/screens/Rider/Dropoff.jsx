import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const LocationDetails = () => {
  const navigation = useNavigation();

  const handleDropOff = () => {
    navigation.navigate("Dropoff");
  };

  return (
    <View style={styles.container}>
      {/* Map Section */}
      <View style={styles.mapContainer}>
        {/* Placeholder for the map */}
        <Text style={styles.mapPlaceholderText}>Map Image Placeholder</Text>
      </View>

      {/* Bottom Details Section */}
      <View style={styles.detailsContainer}>
        {/* Driver Info */}
        <View style={styles.driverInfoContainer}>
          <Ionicons name="person-circle-outline" size={40} color="#333" />
          <View style={styles.driverTextContainer}>
            <Text style={styles.driverName}>Sergio Ramasis</Text>
            <Text style={styles.driverDetails}>4-door (Green SUV)</Text>
            <Text style={styles.driverPhone}>0902-867-711</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.messageButton}
           onPress={() => navigation.navigate("Riderlist")}>
            
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dropOffButton} 
         >
            <Text style={styles.buttonText}>Drop off</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  mapContainer: {
    flex: 1,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: Dimensions.get("window").height * 0.5,
  },
  mapPlaceholderText: {
    color: "#fff",
    fontSize: 16,
  },
  detailsContainer: {
    backgroundColor: "#fff",
    padding: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  driverInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  driverTextContainer: {
    marginLeft: 15,
  },
  driverName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  driverDetails: {
    fontSize: 14,
    color: "#555",
  },
  driverPhone: {
    fontSize: 14,
    color: "#888",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  messageButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  dropOffButton: {
    backgroundColor: "#FFC107",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LocationDetails;
