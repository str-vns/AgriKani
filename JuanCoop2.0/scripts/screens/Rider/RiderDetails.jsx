import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
  TextInput
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { StyleSheet } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageViewer from 'react-native-image-zoom-viewer';
import { removeLocation } from "@redux/Actions/driverActions";

const RiderDetails = (props) => {
  const driver = props.route.params.driver;
  const dispatch = useDispatch()
  const navigation = useNavigation();
  const [expandedOrders, setExpandedOrders] = useState({}); 
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [token, setToken] = useState(null);
 
  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = await AsyncStorage.getItem("jwt");
        setToken(res);
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };

    fetchJwt();
  }, []);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
}

const toggleExpandedOrder = (driverId) => {
  setExpandedOrders((prevState) => ({
    ...prevState,
    [driverId]: !prevState[driverId],
  }));
};

const assignLocation  = (driverId) => {
  navigation.navigate("AssignLocation", { driverId });
}

const maxCoopCapacity = (driverId) => {
  navigation.navigate("MaxCapacity", { driverId });
}

const handleRemoveLocation = (locationId) => {
  Alert.alert(
    "Remove Location",
    "Are you sure you want to remove this location?",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
{
  text: "OK",
  onPress: async () => {
    try {
 
      dispatch(removeLocation(driver._id, locationId, token));
      navigation.navigate("Riderlist");
    } catch (error) {
      console.error("Error removing location:", error);
    }
  },
}
    ]
  );
}

const isExpanded = expandedOrders[driver._id];
  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu-outline" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Driver Details</Text>
      </View> */}
<ScrollView>
      <View style={styles.coopContainer}>
        <Image
          source={{
            uri: driver?.image?.url || "https://via.placeholder.com/150",
          }}
          style={styles.coopImage}
        />

        <View style={styles.coopDetails}>
          <Text style={styles.coopName}>
            {driver?.firstName} {driver?.lastName}
          </Text>
          <Text style={styles.coopEmail}>Email: {driver?.email}</Text>
          <Text style={styles.address}>Gender: {driver?.gender}</Text>
          <Text style={styles.address}>Phone Number: {driver?.phoneNum}</Text>
          <Text
            style={[
              styles.status,
              driver?.approvedAt === null ? styles.notApproved : styles.approved,
            ]}
          >
            Approval Status:{" "}
            {driver?.approvedAt === null ? "Not Approved" : "Approved"}
          </Text>
    
          <Text
            style={[
              styles.status,
              driver?.isAvailable === "false" ? styles.notApproved : styles.approved,
            ]}
          >
            Availability Status:{" "}
            {driver?.isAvailable === "false" ? "Unavailable" : "Available"}
          </Text>
        </View>
      </View>
      <View style={styles.containerFileAll}>
     
         <Text style={styles.requirement}>License</Text>
             <View style={styles.imageContainer}>
              <TouchableOpacity onPress={() => handleImageClick(driver?.driversLicenseImage?.url)}>
               <Image source={{ uri: driver?.driversLicenseImage?.url || "https://via.placeholder.com/150" }} style={styles.imageLook} />
               </TouchableOpacity>
              </View>
      </View>

      {/* <Text>Assigned Location  
  <TouchableOpacity onPress={() => assignLocation({ driverId: driver._id })}>
    <Ionicons name="add-circle-outline" color="green" size={30} style={styles.trashIcon} />
  </TouchableOpacity>
</Text> */}
<View style={styles.assignLocationRow}>
  <Text style={styles.assignLocationText}>Assigned Location</Text>
  <TouchableOpacity onPress={() => assignLocation({ driverId: driver._id })}>
    <Ionicons name="add-circle-outline" color="green" size={30} style={styles.assignLocationIcon} />
  </TouchableOpacity>
</View>


{driver?.assignedLocation?.length > 0 ? (
  <View>
    {isExpanded &&
      driver.assignedLocation.map((assigned) => (
        <View key={assigned._id} style={styles.productCard}>
          <View style={styles.productDetails}>
            <Text>Barangay: {assigned?.barangay}</Text>
            <View style={styles.cityBarangayBox}>
              <Text style={styles.cityText}>City: {assigned?.city}</Text>
              <TouchableOpacity onPress={() => handleRemoveLocation({locationId: assigned._id })}>
                <Ionicons name="trash-outline" color="red" size={20} style={styles.trashIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    
    {driver?.assignedLocation?.length > 0 && (
      <TouchableOpacity
        style={[styles.showAllButton, { backgroundColor: 'transparent' }]}
        onPress={() => toggleExpandedOrder(driver._id)} 
      >
        <Text style={[styles.showAllButtonText, { color: "#808080" }]}>
          {isExpanded ? "Show Less" : "Show All"}
        </Text>
        <Icon
          name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={20}
          style={styles.arrowIcon}
        />
      </TouchableOpacity>
    )}
  </View>
) : (
  <Text>No locations assigned</Text>
)}

      {/* <View>
        <Text>Max Capacity: {""}
          <Text >
            {driver?.maxCapacity || 0}
          </Text>
          <TouchableOpacity onPress={() => maxCoopCapacity({ driverId: driver._id })}>
    <Ionicons name="add-circle-outline" color="green" size={30} style={styles.trashIcon} />
  </TouchableOpacity>
        </Text>
      </View> */}
      <View style={styles.maxCapacityRow}>
  <Text style={styles.maxCapacityText}>Max Capacity:</Text>
  <Text style={styles.maxCapacityValue}>{driver?.maxCapacity || 0}</Text>
  <TouchableOpacity onPress={() => maxCoopCapacity({ driverId: driver._id })}>
    <Ionicons name="add-circle-outline" color="green" size={30} style={styles.maxCapacityIcon} />
  </TouchableOpacity>
</View>

  <Modal 
        visible={modalVisible} 
        transparent={true} 
        onRequestClose={() => setModalVisible(false)}
      >
        
        <View style={styles.modalContainer}>
          <ImageViewer 
  imageUrls={[{ url: selectedImage || "https://via.placeholder.com/150" }]} 
  enableSwipeDown={true} 
  onSwipeDown={() => setModalVisible(false)} 
  style={styles.imageShow}
/>
        </View>
      </Modal>
      </ScrollView>
    </View>
    
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  coopContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  assignLocationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  assignLocationText: {
    fontSize: 16,
    color: "#333",
  },
  assignLocationIcon: {
    marginLeft: 5,  // Space between text and icon
    marginTop: 3,   // Lowers the icon a bit
  },
  maxCapacityRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  maxCapacityText: {
    fontSize: 16,
    color: "#333",
  },
  maxCapacityValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginHorizontal: 5, // Space between "Max Capacity:" and the value
  },
  maxCapacityIcon: {
    marginLeft: 5, // Space between value and icon
    marginTop: 3,  // Adjusts icon alignment to be slightly lower
  },
  
  coopImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  coopDetails: {
    marginTop: 10,
  },
  coopName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  coopEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  approved: {
    color: "green",
  },
  notApproved: {
    color: "red",
  },
  containerFileAll: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  requirement: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  imageLook: {
    width: 120,
    height: 80,
    borderRadius: 5,
  },
  assignContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },

  
  productCard: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cityBarangayBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  cityText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  showAllButton: {
    alignItems: "center",
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
  },
  showAllButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  trashIcon: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageShow: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
  },
});

export default RiderDetails;
