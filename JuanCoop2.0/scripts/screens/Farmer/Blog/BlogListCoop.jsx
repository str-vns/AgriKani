import React, { useCallback, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl, 
  ActivityIndicator, 
  Alert, 
  StyleSheet 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { getBlog } from "@redux/Actions/blogActions";
import { useFocusEffect } from "@react-navigation/native";

const BlogListCoop = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, blogs = [], error } = useSelector((state) => state.allBlogs);
  const [refreshing, setRefreshing] = useState(false);

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

  // Navigate to blog details page
  const handlePressBlog = (item) => {
    navigation.navigate("BlogCards", { blog: item });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blog List</Text>
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator size="large" color="blue" style={styles.loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      ) : blogs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No blogs available.</Text>
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
              onPress={() => handlePressBlog(item)}  // Navigate to BlogCard
            >
              <View style={styles.blogDetails}>
                <Text style={styles.blogTitle}>{item.title}</Text>
                <Text style={styles.blogContent}>{item.content.slice(0, 100)}...</Text>
                <Text style={styles.blogDate}>Published on: {new Date(item.createdAt).toLocaleDateString()}</Text>
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
      justifyContent: "center", // Centers the title horizontally
      padding: 16,
      backgroundColor: "#ffffff",
      elevation: 4,
    },
    menuButton: {
      position: "absolute", // Keeps the menu button on the left
      left: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center", // Ensures the text is centered within the header
    },
    addButton: {
      position: "absolute", // Keeps the add button on the right
      right: 16,
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
  });
  
  
export default BlogListCoop;
