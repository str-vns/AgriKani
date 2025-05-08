import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BlogCards = ({ route, navigation }) => {
  const { blog } = route.params; // Access blog data passed via navigation

  // Function to open links in the default browser
  const handleLinkPress = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Error opening link:", err)
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("BlogLists")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blog</Text>
      </View>

      {/* Blog Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{blog.title}</Text>
        <Text style={styles.date}>
          Published on: {new Date(blog.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.content}>{blog.content}</Text>

        {/* External Website Link */}
        {blog.link && (
          <TouchableOpacity
            onPress={() => handleLinkPress(blog.link)}
            style={styles.linkButton}
          >
            <Text style={styles.linkText}>Visit External Website</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2", // Pure light gray background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Centers the title horizontally
    padding: 16,
    backgroundColor: "#ffffff",
    elevation: 4,
  },
  backButton: {
    position: "absolute", // Keeps the menu button on the left
    left: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center", // Ensures the text is centered within the header
  },
  contentContainer: {
    padding: 24, // Larger padding for better spacing
    margin: 16, // Add some margin for a spacious feel
    backgroundColor: "#ffffff", // White blog card background
    borderRadius: 12, // Subtle rounded corners
    elevation: 3, // Add shadow for a card-like feel
  },
  title: {
    fontSize: 24, // Larger title
    fontWeight: "bold",
    color: "#000", // Black text for the title
    textAlign: "center",
    marginBottom: 16,
  },
  date: {
    fontSize: 14,
    color: "#555", // Slightly darker gray
    marginBottom: 20,
    textAlign: "center",
  },
  content: {
    fontSize: 18, // Larger blog content
    lineHeight: 28, // Better line spacing
    textAlign: "justify",
    color: "#333",
  },
  reference: {
    marginTop: 24, // Add spacing above the reference
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  referenceEmail: {
    color: "#007BFF", // Link color for email
    textDecorationLine: "underline",
  },
  linkButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#FEC120", // Blue background for the link button
    borderRadius: 8,
    alignItems: "center",
  },
  linkText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BlogCards;
