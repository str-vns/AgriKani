import React, { useCallback, useState } from "react";
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
import { getBlog, deleteBlog } from "@redux/Actions/blogActions";
import { useFocusEffect } from "@react-navigation/native";

const BlogList = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, blogs = [], error } = useSelector((state) => state.allBlogs);
  const [refreshing, setRefreshing] = useState(false);
  const token = "YOUR_TOKEN"; // Replace this with your actual token

  // Fetch blogs on screen focus
  useFocusEffect(
    useCallback(() => {
      dispatch(getBlog());
      return () => {
        console.log("Cleaning up on screen unfocus...");
      };
    }, [dispatch])
  );

  // Refresh blogs
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(getBlog());
    } catch (err) {
      console.error("Error refreshing blogs:", err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  // Navigate to blog edit page
  const handleEditBlog = (item) => {
    navigation.navigate("BlogUpdate", { item });
  };

  const handleDeleteBlog = (blogId) => {
    Alert.alert(
      "Delete Blog",
      "Are you sure you want to delete this blog?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Call the deleteBlog action
              await dispatch(deleteBlog(blogId, token));
  
              // If deletion is successful, show success alert
              Alert.alert("Success", "Blog deleted successfully!");
            } catch (error) {
              // If error occurs, show error alert
              Alert.alert("Error", "Failed to delete the blog.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  
  

  return (
    <View style={styles.container}>

      {loading ? (
        <ActivityIndicator size="large" color="blue" style={styles.loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      ) : blogs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No blogs available. Add a blog!</Text>
        </View>
      ) : (
        <FlatList
          data={blogs}
          keyExtractor={(item) => item._id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.blogItem}
              onPress={() => navigation.navigate("BlogCard", { blog: item })}
            >
              <View style={styles.blogDetails}>
                <Text style={styles.blogTitle}>{item.title}</Text>
                <Text style={styles.blogContent}>{item.content.slice(0, 100)}...</Text>
                <Text style={styles.blogDate}>Published on: {new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
              <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={() => handleEditBlog(item)} style={styles.iconButton}>
                  <Ionicons name="pencil" size={24} color="green" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteBlog(item._id)}
                  style={styles.iconButton}
                >
                  <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
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
    paddingHorizontal: 16, // Adjusted to only apply horizontal padding
    paddingVertical: 8,    // Reduced or removed any unnecessary vertical padding
    backgroundColor: "#ffffff",
    elevation: 4,
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",  // This ensures that the title is always centered
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
  blogItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
  },
  blogDetails: {
    flex: 1,
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  blogContent: {
    fontSize: 14,
    color: "#555",
    marginVertical: 4,
  },
  blogDate: {
    fontSize: 12,
    color: "#999",
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

export default BlogList;
