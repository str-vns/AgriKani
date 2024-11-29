import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For the back icon
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { createBlog } from "@redux/Actions/blogActions";

const BlogCreate = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [token, setToken] = useState("");

  const dispatch = useDispatch();
  const context = useContext(AuthGlobal);

  const { loading, error } = useSelector((state) => state.createBlog);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const jwt = await AsyncStorage.getItem("jwt");
        setToken(jwt);
      } catch (err) {
        console.error("Error fetching token:", err);
      }
    };
    fetchToken();
  }, []);

  const handleCreateBlog = () => {
    if (!title || !content || !link) {
      Alert.alert("Validation Error", "All fields are required!");
      return;
    }

    const blogData = {
      title,
      content,
      link,
      user: context?.stateUser?.userProfile?._id,
    };

    dispatch(createBlog(blogData, token))
      .then(() => {
        Alert.alert("Success", "Blog created successfully!");
        setTitle("");
        setContent("");
        setLink("");
        navigation.goBack();
      })
      .catch((err) => {
        console.error("Error creating blog:", err);
        Alert.alert("Error", "Failed to create blog. Please try again.");
      });
  };

  return (
    <View style={styles.container}>
      {/* Back Icon */}
      <TouchableOpacity
        onPress={() => navigation.navigate("BlogList")}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Create New Blog</Text>

      <ScrollView>
        {/* Title Input */}
        <TextInput
          style={styles.input}
          placeholder="Blog Title"
          value={title}
          onChangeText={setTitle}
        />

        {/* Content Input */}
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Blog Content"
          value={content}
          onChangeText={setContent}
          multiline
        />

        {/* Link Input */}
        <TextInput
          style={styles.input}
          placeholder="Link (e.g., https://example.com)"
          value={link}
          onChangeText={setLink}
          keyboardType="url"
        />

        {/* Create Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateBlog}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Blog</Text>
          )}
        </TouchableOpacity>

        {/* Error Message */}
        {error && <Text style={styles.errorText}>Error: {error}</Text>}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    marginTop: 32, // To adjust for the back button
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    elevation: 2,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#FEC120", // Updated button color to match ProductList Create
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 16,
    textAlign: "center",
  },
});

export default BlogCreate;
