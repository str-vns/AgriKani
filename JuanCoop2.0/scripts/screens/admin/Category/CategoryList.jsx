import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  categoryList as getCategories,
  categoryDelete,
} from "@redux/Actions/categoryActions";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const CategoryList = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, categories = [], error } = useSelector((state) => state.categories);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch categories on screen focus
  useFocusEffect(
    useCallback(() => {
      dispatch(getCategories());
      return () => {
        console.log("Cleaning up on screen unfocus...");
      };
    }, [dispatch])
  );

  // Refresh categories
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(getCategories());
    } catch (err) {
      console.error("Error refreshing categories:", err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  const handleAddBlog = () => {
    navigation.navigate("CategoryCreate");
  };

  // Handle edit category
  const handleEditCategory = (category) => {
    navigation.navigate("CategoryUpdate", { category });
  };

  // Handle delete category
  const handleDeleteCategory = (categoryId) => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Dispatch category delete action
            dispatch(categoryDelete(categoryId));
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {/* Content */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu-outline" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Category List</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddBlog}>
          <Ionicons name="add" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="blue" style={styles.loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      ) : categories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No categories available.</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.categoryItem}>
              <View style={styles.categoryDetails}>
                <Text style={styles.categoryName}>{item.categoryName}</Text>
              </View>
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  onPress={() => handleEditCategory(item)}
                  style={styles.iconButton}
                >
                  <Ionicons name="pencil" size={24} color="green" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteCategory(item._id)}
                  style={styles.iconButton}
                >
                  <Ionicons name="trash" size={24} color="red" />
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
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16, // Adjusted to only apply horizontal padding
    paddingVertical: 8, // Reduced or removed any unnecessary vertical padding
    backgroundColor: "#ffffff",
    elevation: 4,
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center", // This ensures that the title is always centered
  },
  addButton: {
    padding: 8,
  },
});

export default CategoryList;
