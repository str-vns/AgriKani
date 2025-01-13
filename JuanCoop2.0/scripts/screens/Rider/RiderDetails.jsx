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
import styles from "@screens/stylesheets/Admin/Coop/Cooplist";
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu-outline" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Driver Details</Text>
      </View>
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

      <Text>Assigned Location  
  <TouchableOpacity onPress={() => assignLocation({ driverId: driver._id })}>
    <Ionicons name="add-circle-outline" color="green" size={30} style={styles.trashIcon} />
  </TouchableOpacity>
</Text>

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

      <View>
        <Text>Max Capacity: {""}
          <Text >
            {driver?.maxCapacity || 0}
          </Text>
          <TouchableOpacity onPress={() => maxCoopCapacity({ driverId: driver._id })}>
    <Ionicons name="add-circle-outline" color="green" size={30} style={styles.trashIcon} />
  </TouchableOpacity>
        </Text>
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

export default RiderDetails;
