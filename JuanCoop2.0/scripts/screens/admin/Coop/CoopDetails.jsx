import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView, 
  StyleSheet,
  RefreshControl, // Import RefreshControl
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
// import styles from "@screens/stylesheets/Admin/Coop/Cooplist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { activeCooperative, deleteCooperative } from "@redux/Actions/coopActions";
import messaging from '@react-native-firebase/messaging';
import { sendNotifications } from "@redux/Actions/notificationActions";

const CoopDetails = (props) => {
  const coops = props.route.params.coop;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // State for refresh control

  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = await AsyncStorage.getItem("jwt");
        setToken(res);
        messaging().getToken().then((token) => {
          setFcmToken(token);
        });
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };

    fetchJwt();
  }, []);

  const handleApprove = async (coopId, userId) => {
    Alert.alert(
      "Approve Cooperative",
      "Are you sure you want to approve this cooperative?",
      [
        {
          text: "Yes",
          onPress: async () => {
            try {

              const data = {
                title: "Cooperative Approval",
                body: "Your cooperative has been approved.",
                user: userId,
                fcmToken: fcmToken,
                type: "profile",
              }

              setIsLoading(true);
              dispatch(activeCooperative(coopId, userId, token));
              dispatch(sendNotifications(data, token));
              navigation.navigate("CoopList");
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

  const handleDelete = (coopId, userId) => {
    Alert.alert(
      "Disapprove Cooperative",
      "Are you sure you want to Disapprove this cooperative?",
      [
        {
          text: "Yes",
          onPress: async () => {
            try {
              
              const data = {
                title: "Cooperative Approval",
                body: "Your cooperative has been disapproved. Please provide the necessary requirements. Thank you.",
                user: userId,
                fcmToken: fcmToken,
                type: "profile",
              }

              setIsLoading(true);
              dispatch(deleteCooperative(coopId,token));
              dispatch(sendNotifications(data, token));
              navigation.navigate("CoopList");
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

  const handleFileOpen = (fileUrl) => {
    if (fileUrl) {
      Linking.openURL(fileUrl).catch(() => {
        Alert.alert("Error", "Unable to open the file. Please try again.");
      });
    } else {
      Alert.alert("No File", "The business permit file is not available.");
    }
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
          <Text style={styles.headerTitle}>Coop Details</Text>
        </View> */}

        <View style={styles.coopContainer}>
          <Image
            source={{
              uri: coops?.image[0]?.url || "https://via.placeholder.com/150",
            }}
            style={styles.coopImage}
          />

          <View style={styles.coopDetails}>
            <Text style={styles.coopName}>
              {coops?.user?.firstName} {coops?.user?.lastName}
            </Text>
            <Text style={styles.farmName}>Cooperative Name: {coops?.farmName}</Text>
            <Text style={styles.coopEmail}>Email: {coops?.user?.email}</Text>
            <Text style={styles.address}>Address: {coops?.address}</Text>
            <Text style={styles.address}>Barangay: {coops?.barangay}</Text>
            <Text style={styles.address}>City: {coops?.city}</Text>
            <Text style={styles.address}>
              Tin Number: {coops?.requirements?.tinNumber}
            </Text>
            <Text
              style={[
                styles.status,
                coops?.approvedAt === null ? styles.notApproved : styles.approved,
              ]}
            >
              Approval Status:{" "}
              {coops?.approvedAt === null ? "Pending" : "Approved"}
            </Text>
          </View>
        </View>
        <View style={styles.containerFileAll}>
          <View style={styles.containerFile}>
            <Text style={styles.labelFile}>Business Permit:</Text>
            {coops?.requirements?.businessPermit?.url ? (
              <View style={styles.buttonFile}>
                <TouchableOpacity
                  onPress={() =>
                    handleFileOpen(
                      coops?.requirements?.businessPermit?.url || "Not Provided"
                    )
                  }
                >
                  <Text style={styles.buttonTextFile}>View or Download</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.textProvide}>Not Provided</Text>
            )}
          </View>
          <View style={styles.containerFile}>
            <Text style={styles.labelFile}>Cor CDA:</Text>
            {coops?.requirements?.corCDA?.url ? (
              <View style={styles.buttonFile}>
                <TouchableOpacity
                  onPress={() =>
                    handleFileOpen(
                      coops?.requirements?.corCDA?.url || "Not Provided"
                    )
                  }
                >
                  <Text style={styles.buttonTextFile}>View or Download</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.textProvide}>Not Provided</Text>
            )}
          </View>

          <View style={styles.containerFile}>
            <Text style={styles.labelFile}>Organize Structure:</Text>
            {coops?.requirements?.orgStructure?.url ? (
              <View style={styles.buttonFile}>
                <TouchableOpacity
                  onPress={() =>
                    handleFileOpen(
                      coops?.requirements?.orgStructure?.url || "Not Provided"
                    )
                  }
                >
                  <Text style={styles.buttonTextFile}>View or Download</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.textProvide}>Not Provided</Text>
            )}
          </View>
        </View>
        <View style={styles.containerFile}></View>
        {coops?.approvedAt === null && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.approvedButton}
              onPress={() => handleApprove(coops?._id, coops?.user?._id)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="black" />
              ) : (
                <Text style={styles.buttonApproveText}>Approved</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dapprovedButton}
              onPress={() => handleDelete(coops?._id, coops?.user?._id)} // Pass userId to handleDelete
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="black" />
              ) : (
                <Text style={styles.buttonApproveText}>Decline</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  scrollContainer: { paddingVertical: 20 },
  container: { flex: 1, padding: 20, backgroundColor: "#FFFFFF" },
  coopContainer: { alignItems: "center", marginBottom: 20 },
  coopImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  coopDetails: { alignItems: "center" },
  coopName: { fontSize: 18, fontWeight: "bold" },
  farmName: { fontSize: 16, color: "gray" },
  coopEmail: { fontSize: 14, color: "gray" },
  address: { fontSize: 14, color: "gray" },
  status: { fontSize: 14, fontWeight: "bold", marginTop: 10 },
  approved: { color: "green" },
  dapproved: { color: "red" },
  notApproved: { color: "red" },
  containerFileAll: { marginTop: 20 },
  containerFile: { marginBottom: 10 },
  labelFile: { fontSize: 14, fontWeight: "bold" },
  buttonFile: { backgroundColor: "#007bff", padding: 10, borderRadius: 5, alignItems: "center", marginTop: 5 },
  buttonTextFile: { color: "white", fontSize: 14 },
  textProvide: { color: "gray", fontSize: 14 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  approvedButton: { flex: 1, backgroundColor: "#28a745", padding: 10, borderRadius: 5, alignItems: "center", marginRight: 10 },
dapprovedButton: { flex: 1, backgroundColor: "#E31837", padding: 10, borderRadius: 5, alignItems: "center", marginRight: 10 },
  declineButton: { flex: 1, backgroundColor: "#dc3545", padding: 10, borderRadius: 5, alignItems: "center" },
  buttonApproveText: { color: "white", fontSize: 14, fontWeight: "bold" },
  buttonDeclineText: { color: "white", fontSize: 14, fontWeight: "bold" },
});

export default CoopDetails;
