import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import styles from "@screens/stylesheets/Admin/Coop/Cooplist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { activeCooperative, deleteCooperative } from "@redux/Actions/coopActions";

const CoopDetails = (props) => {
  const coops = props.route.params.coop;
  const dispatch = useDispatch();
  const navigation = useNavigation();
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

  const handleApprove = (coopId, userId) => {
    setIsLoading(true);
    dispatch(activeCooperative(coopId, userId, token));
    setIsLoading(false);
    navigation.navigate("CoopList");
  };

  const handleDelete = (coopId) => {
    setIsLoading(true);
    dispatch(deleteCooperative(coopId,token));
    setIsLoading(false);
    navigation.navigate("CoopList");
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu-outline" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Coop Details</Text>
      </View>

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
          <Text style={styles.farmName}>Farm Name: {coops?.farmName}</Text>
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
            {coops?.approvedAt === null ? "Not Approved" : "Approved"}
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
            style={styles.approvedButton}
            onPress={() => handleDelete(coops?._id)}
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
  );
};

export default CoopDetails;
