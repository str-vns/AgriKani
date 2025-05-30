import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { listDriverDisapproved } from "@redux/Actions/driverActions";
import styles from "@screens/stylesheets/Admin/Coop/Cooplist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SelectedTab } from "@shared/SelectedTab";

const DriverList = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const { loading, drivers, error } = useSelector((state) => state.driverList);
  const [selectedTab, setSelectedTab] = useState("DPending");
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

  useFocusEffect(
    useCallback(() => {
      dispatch(listDriverDisapproved(token));
      return () => {
        console.log("Cleaning up on screen unfocus...");
      };
    }, [token])
  );

  // Refresh users
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      dispatch(listDriverDisapproved(token));
    } catch (err) {
      console.error("Error refreshing users:", err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, token]);

  const choicesTab = [
    { label: "Pending", value: "DPending" },
    { label: "Approved", value: "DApproved" },
  ];

  return (
    <View style={styles.container}>
      <SelectedTab
        selectedTab={selectedTab}
        tabs={choicesTab}
        onTabChange={setSelectedTab}
      />
     
      {loading ? (
        <ActivityIndicator size="large" color="blue" style={styles.loader} />
      ) : drivers?.length === 0 || error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Driver found.</Text>
        </View>
      ) : (
        <FlatList
          data={drivers.details}
          keyExtractor={(item) => item?._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No drivers available.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <Image
                source={{
                  uri: item?.image?.url || "https://via.placeholder.com/150",
                }}
                style={styles.profileImage}
              />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>
                  {item?.firstName}
                  {item?.lastName}
                </Text>
                <Text style={styles.userEmail}>{item?.email}</Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("DriverDetails", { driver: item })
                }
              >
                <Text style={styles.viewButton}>View</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default DriverList;
