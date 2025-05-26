import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { typeList, typeDelete } from "@redux/Actions/typeActions";

const TypeList = ({ navigation }) => {
  const dispatch = useDispatch();

  // Get state from Redux
  const { loading, types = [], error } = useSelector((state) => state.types);
  const {
    loading: deleteLoading,
    success: deleteSuccess,
    error: deleteError,
  } = useSelector((state) => state.typesDelete);

  const [refreshing, setRefreshing] = useState(false);

  // Fetch the list of types on component mount
  useEffect(() => {
    dispatch(typeList());
  }, [dispatch]);

  // Refetch types when a type is deleted successfully
  useEffect(() => {
    if (deleteSuccess) {
      dispatch(typeList()); // Refresh the list
      Alert.alert("Success", "Type deleted successfully!");
    }
    if (deleteError) {
      Alert.alert("Error", deleteError || "Failed to delete type.");
    }
  }, [deleteSuccess, deleteError, dispatch]);

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(typeList());
    } catch (err) {
      console.error("Error refreshing types:", err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  // Edit type handler
  const handleEditType = (type) => {
    navigation.navigate("TypeUpdate", { type });
  };

  // Delete type handler
  const handleDeleteType = (typeId) => {
    Alert.alert(
      "Delete Type",
      "Are you sure you want to delete this type?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(typeDelete(typeId));
            } catch (err) {
              console.error("Error deleting type:", err);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
  
      {/* Content */}
      {loading ? (
        <ActivityIndicator size="large" color="blue" style={styles.loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      ) : types.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No types available. Add a type!</Text>
        </View>
      ) : (
        <FlatList
          data={types}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.typeItem}>
              <View style={styles.typeDetails}>
                <Text style={styles.typeName}>{item.typeName}</Text>
              </View>
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  onPress={() => handleEditType(item)}
                  style={styles.iconButton}
                >
                  <Ionicons name="pencil" size={24} color="green" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteType(item._id)}
                  style={styles.iconButton}
                  disabled={deleteLoading} // Disable button while deleting
                >
                  {deleteLoading ? (
                    <ActivityIndicator size="small" color="red" />
                  ) : (
                    <Ionicons name="trash" size={24} color="red" />
                  )}
                </TouchableOpacity>
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
  addButton: {
    padding: 8,
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
  typeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
  },
  typeDetails: {
    flex: 1,
  },
  typeName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 8,
    padding: 8,
  },
});

export default TypeList;
