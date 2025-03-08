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
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import styles from "@screens/stylesheets/Admin/Coop/Cooplist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageViewer from "react-native-image-zoom-viewer";
import { driverApproved, driverRejected } from "@redux/Actions/driverActions";
import messaging from "@react-native-firebase/messaging";

const DriverDetails = (props) => {
  const driver = props.route.params.driver;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = await AsyncStorage.getItem("jwt");
        setToken(res);
        messaging()
          .getToken()
          .then((token) => {
            setFcmToken(token);
          });
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };

    fetchJwt();
  }, []);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const handleApprove = async (driverId) => {
    Alert.alert(
      "Driver Approval",
      "Are you sure you want to Approve this Driver?",
      [
        {
          text: "Yes",
          onPress: async () => {
            try {
              setIsLoading(true);
              dispatch(driverApproved(driverId, fcmToken, token));
              navigation.navigate("DriverList");
            } finally {
              setIsLoading(false);
            }
          },
        },
        {
          text: "No",
          style: "cancel",
        },
      ]
    );
  };

  const handleDelete = async (driverId) => {
    Alert.alert(
      "Driver Disapproval",
      "Are you sure you want to Disapprove this Driver?",
      [
        {
          text: "Yes",
          onPress: async () => {
            try {
              setIsLoading(true);
              dispatch(driverRejected(driverId, fcmToken, token));
              navigation.navigate("DriverList");
            } finally {
              setIsLoading(false);
            }
          },
        },
        {
          text: "No",
          style: "cancel",
        },
      ]
    );
  };

  return (
    <ScrollView>
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
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={28} color="black" />
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
            <Text style={styles.address}>
              Farm Driver: {driver?.coopId?.farmName}
            </Text>
            <Text style={styles.address}>
              Farm Address: {driver?.coopId?.address},{" "}
              {driver?.coopId?.barangay}, {driver?.coopId?.city}
            </Text>
            <Text
              style={[
                styles.status,
                driver?.approvedAt === null
                  ? styles.notApproved
                  : styles.approved,
              ]}
            >
              Approval Status:{" "}
              {driver?.approvedAt === null ? "Pending" : "Approved"}
            </Text>
          </View>
        </View>
        <View style={styles.containerFileAll}>
          <Text style={styles.requirement}>License</Text>
          <View style={styles.imageContainer}>
            <TouchableOpacity
              onPress={() => handleImageClick(driver?.driversLicenseImage?.url)}
            >
              <Image
                source={{
                  uri:
                    driver?.driversLicenseImage?.url ||
                    "https://via.placeholder.com/150",
                }}
                style={styles.imageLook}
              />
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
        ) : null
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
        }

        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <ImageViewer
              imageUrls={[
                { url: selectedImage || "https://via.placeholder.com/150" },
              ]}
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
