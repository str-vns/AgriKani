import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Linking,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import styles from "@screens/stylesheets/Admin/Coop/Cooplist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageViewer from 'react-native-image-zoom-viewer';
import { driverApproved, driverRejected } from "@redux/Actions/driverActions";

const DriverDetails = (props) => {
  const driver = props.route.params.driver;
  const dispatch = useDispatch()
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

    const handleApprove = async (driverId) => {
        setIsLoading(true);

        try {
            dispatch(driverApproved(driverId, token));
            Alert.alert("Driver approved successfully");
            navigation.navigate("DriverList");
        } catch (error) {
            Alert.alert("Error approving driver");
        } finally {
            setIsLoading(false);
        }
    }
        
    const handleDelete = async (driverId) => {
        setIsLoading(true);

        try {
            dispatch(driverRejected(driverId, token));
            Alert.alert("Driver rejected successfully");
            navigation.navigate("DriverList");
        } catch (error) {
            Alert.alert("Error rejecting driver");
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <ScrollView> 
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
          <Text style={styles.address}>Farm Driver: {driver?.coopId?.farmName}</Text>
          <Text style={styles.address}>
            Farm Address: {driver?.coopId?.address}, {driver?.coopId?.barangay}, {driver?.coopId?.city} 
          </Text>
          <Text
            style={[
              styles.status,
              driver?.approvedAt === null ? styles.notApproved : styles.approved,
            ]}
          >
            Approval Status:{" "}
            {driver?.approvedAt === null ? "Not Approved" : "Approved"}
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

 {driver?.approvedAt === null ? (
  <View style={styles.buttonContainer}>
    {/* Approve Button */}
    <TouchableOpacity
      style={styles.approvedButton}
      onPress={() => handleApprove(driver?._id)}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="black" />
      ) : (
        <Text style={styles.buttonApproveText}>Approve</Text>
      )}
    </TouchableOpacity>

    {/* Decline Button */}
    <TouchableOpacity
      style={styles.approvedButton}
      onPress={() => handleDelete(driver?._id)}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="black" />
      ) : (
        <Text style={styles.buttonApproveText}>Decline</Text>
      )}
    </TouchableOpacity>
  </View>
) : (
    null
//   <View style={styles.buttonContainer}>
//     {/* Only Decline Button if already approved */}
//     <TouchableOpacity
//       style={styles.approvedButton}
//       onPress={() => handleRemove(driver?._id)}
//       disabled={isLoading}
//     >
//       {isLoading ? (
//         <ActivityIndicator size="small" color="black" />
//       ) : (
//         <Text style={styles.buttonApproveText}>Remove</Text>
//       )}
//     </TouchableOpacity>
//   </View>
)}

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
      
    </View>
    </ScrollView>
  );
};

export default DriverDetails;
