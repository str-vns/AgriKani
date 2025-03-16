import React, { useCallback, useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { singleDriver } from "@redux/Actions/driverActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { removeDriver } from "@redux/Actions/driverActions";
import { Alert } from "react-native";

const Riderlist = () => {
  const context = useContext(AuthGlobal);
  const userId = context.stateUser?.userProfile?._id;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { loading, drivers, error } = useSelector((state) => state.driverList);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState("Rider");

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
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      dispatch(singleDriver(userId, token));
      return () => {
        console.log("Cleaning up on screen unfocus...");
      };
    }, [dispatch, token, userId])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      dispatch(singleDriver(userId, token));
    } catch (err) {
      console.error("Error refreshing users:", err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, token]);

  const handleDelete = async (driverId) => {
    Alert.alert(
      "Delete Driver",
      "Are you sure you want to delete this driver?",
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
              dispatch(removeDriver(driverId, token));
              console.log("Driver deleted successfully");
              onRefresh();
            } catch (error) {
              console.error("Error deleting driver: ", error);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.riderContainer}>
      <Image
        source={{
          uri: item.image?.url
            ? item.image.url
            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEL1_AFmfB9y1WAQ_lEcF7z8DFGDPQpycmw&s",
        }}
        style={styles.profileImage}
      />
      <View style={styles.infoContainer}>
        <View style={styles.itemContainer}>
          <Text style={styles.name}>
            {item.firstName} {item.lastName}
          </Text>
          <TouchableOpacity onPress={() => handleDelete(item._id)}>
            <Ionicons name="trash-outline" color="red" size={20} />
          </TouchableOpacity>
        </View>
        <Text>
          Approved:{" "}
          <Text style={{ color: item.approvedAt ? "green" : "red" }}>
            {item.approvedAt ? " Approved" : " Not Approved"}
          </Text>
        </Text>

        <Text>
          Available:{" "}
          <Text style={{ color: item?.isAvailable ? "green" : "red" }}>
            {item?.isAvailable ? "Available" : "Unavailable"}
          </Text>
        </Text>
        {item.approvedAt ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.assignButton}
              onPress={() => navigation.navigate("Assign", { driver: item })}
            >
              <Text style={styles.assignButtonText}>Assigned</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.assignButton}
              onPress={() =>
                navigation.navigate("RiderDetails", { driver: item })
              }
            >
              <Text style={styles.assignButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header2}>
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle2}>Rider List</Text>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            navigation.navigate("Register");
            console.log("Button Pressed");
          }}
        >
          <Text style={styles.buttonText}>Add Rider</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "Assign" && styles.activeTab]}
          onPress={() => navigation.navigate("AssignList")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Assign" && styles.activeTabText,
            ]}
          >
            Assign
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "Rider" && styles.activeTab]}
          onPress={() => setActiveTab("Rider")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Rider" && styles.activeTabText,
            ]}
          >
            Rider
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : drivers?.length === 0 || error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Driver found.</Text>
        </View>
      ) : (
        <FlatList
          data={drivers}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

export default Riderlist;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    paddingBottom:70,
  },
  header2: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    elevation: 3,
  },
  headerTitle2: {
    fontSize: 22,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    color: "#333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
  },
  activeTab: {
    borderBottomColor: "#FFC107",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#FFC107",
    fontWeight: "bold",
  },
  drawerButton: {
    marginRight: 10,
  },
  headerButton: {
    backgroundColor: "#06b6d4",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  listContainer: {
    padding: 10,
    paddingBottom: 70,
  },
  riderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Better spacing
    marginTop: 8,
  },
  historyButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  historyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  assignButton: {
    backgroundColor: "#008CBA", // Changed from green to navy blue
    paddingVertical: 8,
    paddingHorizontal: 35,
    borderRadius: 8,
    marginRight: 10, // Added margin for spacing
  },
  assignButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  viewButton: {
    backgroundColor: "#1E3A8A", // Changed from green to navy blue
    paddingVertical: 8,
    paddingHorizontal: 35,
    borderRadius: 8,
  },
  viewButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#777",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    marginLeft: -10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});
