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
import { inactiveCooperative } from "@redux/Actions/coopActions";
import styles from "@screens/stylesheets/Admin/Coop/Cooplist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Cooplist = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const { loading, coops, error } = useSelector((state) => state.allofCoops);
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
      dispatch(inactiveCooperative(token));
      return () => {
        console.log("Cleaning up on screen unfocus...");
      };
    }, [dispatch, token])
  );

  // Refresh users
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      dispatch(inactiveCooperative(token));
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
        <Text style={styles.headerTitle}>Coop List</Text>
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
            navigation.navigate("CoopActive");
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
      ) : coops?.length === 0 || error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No cooperative found.</Text>
        </View>
      ) : (
        <FlatList
          data={coops}
          keyExtractor={(item) => item?._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <Image
                source={{
                  uri: item?.image[0]?.url || "https://via.placeholder.com/150", // Fallback to placeholder image
                }}
                style={styles.profileImage}
              />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{item?.farmName}</Text>
                <Text style={styles.userEmail}>{item?.user?.email}</Text>
                <Text style={styles.userRole}>Address: {item?.address}</Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("CoopDetails", { coop: item })
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

export default Cooplist;
