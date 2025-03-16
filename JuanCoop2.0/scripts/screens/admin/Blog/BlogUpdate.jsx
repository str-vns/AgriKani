import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { updateBlog } from "@redux/Actions/blogActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const BlogUpdate = (props) => {
  const singleBlog = props.route.params.item;
  const dispatch = useDispatch();
  const context = useContext(AuthGlobal);
  const navigation = useNavigation();

  const [title, setTitle] = useState(singleBlog?.title || "");
  const [content, setContent] = useState(singleBlog?.content || "");
  const [link, setLink] = useState(singleBlog?.link || "");
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState("");
  const blogId = singleBlog?._id;

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

  const handleUpdateBlog = async () => {
    if (!title || !content || !link) {
      setErrors("Please fill in all fields");
      return;
    }

    const blogItem = {
      title,
      content,
      link,
    };

    try {
      dispatch(updateBlog(blogId, blogItem, token));
      setTimeout(() => {
        setErrors("");
        navigation.navigate("BlogList");
      }, 5000);
    } catch (error) {
      console.error("Error updating blog:", error);
      setErrors("Failed to update blog. Please try again.");
    }
  };

  const backButton = () => {
    navigation.navigate("BlogList");
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity style={styles.backButton} onPress={backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Update Blog</Text> */}

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
          placeholder="Blog Link"
          value={link}
          onChangeText={setLink}
        />

        {/* Error Message */}
        {errors && <Text style={styles.errorText}>{errors}</Text>}

        {/* Update Button */}
        <TouchableOpacity style={styles.button} onPress={handleUpdateBlog}>
          <Text style={styles.buttonText}>Update Blog</Text>
        </TouchableOpacity>
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
    marginTop: 32, // Adjust to account for back button
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
    backgroundColor: "#FEC120", // Matches button color from BlogCreate
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

export default BlogUpdate;
