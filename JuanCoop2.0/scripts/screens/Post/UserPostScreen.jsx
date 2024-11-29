import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost, clearErrors, getUserPost, fetchApprovedPosts } from "@src/redux/Actions/postActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { useNavigation, useRoute } from "@react-navigation/native";
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  Alert, 
  ActivityIndicator, 
  Image, 
  TouchableOpacity, 
  ScrollView 
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const UserPostScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const context = useContext(AuthGlobal);

  const userId = context?.stateUser?.userProfile?._id; // Get user ID for the author field
  const { action, post } = route.params; // Get action and post from route params

  const postId = post?._id || route.params?.postId; // Get post ID for editing
  const { loading, error } = useSelector((state) => state.post);

  const [content, setContent] = useState("");
  const [images, setImages] = useState([]); // Store uploaded images
  const [previewImages, setPreviewImages] = useState([]); // For image previews

  // Handle errors
  // useEffect(() => {
  //   if (error) {
  //     Alert.alert("Error", error);
  //     dispatch(clearErrors());
  //   }
  // }, [dispatch, error]);

  // Pre-fill the form if editing
  useEffect(() => {
    if (action === 'edit' && post) {
      setContent(post.content || "");
      setPreviewImages(post.image?.map((img) => img.url) || []);
    }
  }, [action, post]);

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Denied", "You need to allow access to your photos to upload images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // iOS only
      quality: 1, // Adjust image quality
    });

    if (!result.canceled) {
      const selectedImages = result.assets || [result];
      setImages(selectedImages);
      setPreviewImages(selectedImages.map((img) => img.uri));
    }
  };

  const handleSubmit = () => {
    if (!content) {
      Alert.alert("Error", "Content is required.");
      return;
    }
  
    const postData = {
      content: content,
      author: userId,
      images: images.map((image) => image.uri), // Or other format depending on your backend
    };

    const formData = new FormData();
    formData.append("content", content);
    formData.append("author", userId);
  
    images.forEach((image) => {
      formData.append("image", {
        uri: image.uri,
        type: "image/jpeg",
        name: `image_${Date.now()}.jpg`,
      });
    });
  
    if (postId) {
      dispatch(updatePost(postId, postData)).then(() => {
        Alert.alert(
          "Success",
          "Post updated successfully!",
          [
            {
              text: "OK",
              onPress: () => {
                dispatch(getUserPost(userId));
                navigation.navigate("UserPostList");
              },
            },
          ]
        );
      });
    } else {
      dispatch(createPost(formData)).then(() => {
        Alert.alert(
          "Success",
          "Post created successfully!",
          [
            {
              text: "OK",
              onPress: () => {
                dispatch(fetchApprovedPosts());
                navigation.navigate("CommunityForum");
              },
            },
          ]
        );
      });
    }
  };
  
  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: "#f5f5f5" }}>
      <Text style={{
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
        textAlign: "center"
      }}>
        {action === "edit" ? "Edit Post" : "Create Post"}
      </Text>

      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="What's on your mind?"
        style={{
          borderColor: "#ddd",
          borderWidth: 1,
          borderRadius: 8,
          padding: 15,
          marginBottom: 15,
          fontSize: 16,
          minHeight: 150,
          backgroundColor: "#fff",
          textAlignVertical: "top",
        }}
        multiline
      />

      <TouchableOpacity 
        onPress={handleImagePicker} 
        style={{
          backgroundColor: "#007BFF", 
          paddingVertical: 12, 
          paddingHorizontal: 20, 
          borderRadius: 8, 
          marginBottom: 20,
          alignItems: "center"
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>Upload Images</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", flexWrap: "wrap", marginVertical: 10 }}>
        {previewImages.map((img, index) => (
          <Image
            key={index}
            source={{ uri: img }}
            style={{
              width: 100,
              height: 100,
              marginRight: 10,
              marginBottom: 10,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: "#ddd"
            }}
          />
        ))}
      </View>

      <Button
        title={loading ? "Saving..." : action === "edit" ? "Update Post" : "Create Post"}
        onPress={handleSubmit}
        color="#007BFF"
        disabled={loading}
      />

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} color="#007BFF" />}
    </ScrollView>
  );
};

export default UserPostScreen;