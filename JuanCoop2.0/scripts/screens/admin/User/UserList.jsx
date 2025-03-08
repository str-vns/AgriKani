import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { getAllUsers, softDeleteUser, restoreUser } from '@src/redux/Actions/userActions';
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserList = ({ navigation }) => {
  const dispatch = useDispatch();
  const [token, setToken] = useState(null);
  const { loading, users, error } = useSelector((state) => state.allUsers);
  const [isFetched, setIsFetched] = useState(false);  // Track if users have been fetched

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

  // Fetch users only when token changes or component mounts
  useFocusEffect(
    useCallback(() => {
      if (token && !isFetched) {
        dispatch(getAllUsers(token));
        setIsFetched(true);  // Mark as fetched after getting the users
      }
      return () => {
        console.log("Cleaning up on screen unfocus...");
      };
    }, [dispatch, token, isFetched])
  );

  // Soft delete user
  const handleSoftDelete = (userId) => {
    dispatch(softDeleteUser(userId, token)); // Dispatch the soft delete action
  };

  // Restore user
  const handleRestore = (userId) => {
    dispatch(restoreUser(userId, token)); // Dispatch the restore action
    alert("User restored successfully!"); // Notify the user
  };

  return (
    <View style={styles.container}>
      {/* Header */}
       <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={28} color="black" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>User List</Text>
            </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator size="large" color="blue" style={styles.loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      ) : users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No users found.</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View
              style={[
                styles.userItem,
                item.isDeleted ? styles.deletedUserItem : null, // Lighten the item if soft deleted
              ]}
            >
              {/* Profile Image */}
              <Image
                source={{
                  uri: item.image?.url || "https://via.placeholder.com/150", // Fallback to placeholder image
                }}
                style={styles.profileImage}
              />
              {/* User Details */}
              <View style={styles.userDetails}>
                <Text style={styles.userName}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <Text style={styles.userRole}>
                  Role: {Array.isArray(item.roles) ? item.roles.join(", ") : item.roles}
                </Text>
              </View>
              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                {/* Soft Delete Icon */}
                {!item.isDeleted && (
                  <TouchableOpacity
                    onPress={() => handleSoftDelete(item._id)}
                    style={styles.iconButton}
                  >
                    <Ionicons name="trash-outline" size={24} color="red" />
                  </TouchableOpacity>
                )}
                {/* Restore Icon */}
                {item.isDeleted && (
                  <TouchableOpacity
                    onPress={() => handleRestore(item._id)}
                    style={styles.iconButton}
                  >
                    <Ionicons name="refresh-outline" size={24} color="green" />
                  </TouchableOpacity>
                )}
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
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row", // Stack icons vertically
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 1,
  },
  iconButton: {
    padding: 8, // Increased padding for better click area
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",  // Ensure text is centered
    flex: 1, 
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
  deletedUserItem: {
    backgroundColor: "#f0f0f0", // Lighten the background for soft deleted users
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

export default UserList;
