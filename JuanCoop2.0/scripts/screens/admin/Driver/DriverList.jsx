import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Image, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { listDriverDisapproved } from "@redux/Actions/driverActions";
import styles from "@screens/stylesheets/Admin/Coop/Cooplist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DriverList = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const { loading, drivers, error } = useSelector((state) => state.driverList);
  const [selectedTab, setSelectedTab] = useState("Not_Approved");
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu-outline" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Driver List</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "Not_Approved" && styles.activeTab,
          ]}
          onPress={() => {
            setSelectedTab("Not_Approved");
          }}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Not_Approved" && styles.activeTabText,
            ]}
          >
            Not Approved
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "Approved" && styles.activeTab,
          ]}
          onPress={() => {
            navigation.navigate("DriverActive");
          }}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Approved" && styles.activeTabText,
            ]}
          >
            Approved
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
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
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <Image
                source={{
                  uri: item?.image?.url || "https://via.placeholder.com/150",
                }}
                style={styles.profileImage}
              />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{item?.firstName}{item?.lastName}</Text>
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
