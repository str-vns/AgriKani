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
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [refreshing, setRefreshing] = useState(false); // State for refresh control

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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Add your refresh logic here
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
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
              Cooperative Driver: {driver?.coopId?.farmName}
            </Text>
            <Text style={styles.address}>
              Cooperative Address: {driver?.coopId?.address},{" "}
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
              style={styles.imageLook}
            >
              <Image
                source={{
                  uri: driver?.driversLicenseImage?.url,
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
        ) : null}

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

const styles = StyleSheet.create({
  scrollContainer: { paddingVertical: 20 },
  container: { flex: 1, padding: 20, backgroundColor: "#FFFFFF" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backButton: { marginRight: 10 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  coopContainer: { alignItems: "center", marginBottom: 20 },
  coopImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  coopDetails: { alignItems: "center" },
  coopName: { fontSize: 18, fontWeight: "bold" },
  coopEmail: { fontSize: 14, color: "gray" },
  address: { fontSize: 14, color: "gray" },
  status: { fontSize: 14, fontWeight: "bold", marginTop: 10 },
  approved: { color: "green" },
  notApproved: { color: "red" },
  containerFileAll: { marginTop: 20 },
  requirement: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  imageContainer: { alignItems: "center" },
  imageLook: { width: 200, height: 200, marginBottom: 10 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  approvedButton: { flex: 1, backgroundColor: "#28a745", padding: 10, borderRadius: 5, alignItems: "center", marginRight: 10 },
  buttonApproveText: { color: "white", fontSize: 14, fontWeight: "bold" },
  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center" },
  imageShow: { width: "100%", height: "100%" },
});

export default DriverDetails;
