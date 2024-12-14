import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { allCoops } from "@redux/Actions/coopActions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Cooplist = ({ navigation }) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const { loading, coops, error } = useSelector((state) => state.allofCoops);

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
      dispatch(allCoops(token));
      return () => {
        console.log("Cleaning up on screen unfocus...");
      };
    }, [dispatch, token])
  );

  // Refresh users
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
     dispatch(allCoops(token));
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
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu-outline" size={34} color="black" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Coop List</Text>
    </View>

    {/* Content */}
    {loading ? (
      <ActivityIndicator size="large" color="blue" style={styles.loader} />
    ) : error ? (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    ) : coops.length === 0 ? (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No cooperative found.</Text>
      </View>
    ) : (
      <FlatList
        data={coops}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Image
              source={{
                uri: item.image[0].url || "https://via.placeholder.com/150", // Fallback to placeholder image
              }}
              style={styles.profileImage}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{item.farmName}</Text>
              <Text style={styles.userEmail}>{item.user.email}</Text>
              <Text style={styles.userRole}>
  Address: {item.address}
</Text>
            </View>
          </View>
        )}
      />
    )}
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    elevation: 4,
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  loader: {
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
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
  listContainer: {
    paddingHorizontal: 16,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#555",
    marginVertical: 4,
  },
  userRole: {
    fontSize: 12,
    color: "#777",
  },
});

export default Cooplist;
