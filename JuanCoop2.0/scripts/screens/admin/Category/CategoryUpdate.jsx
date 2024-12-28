import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { categoryEdit } from "@redux/Actions/categoryActions";

const EditCategory = ({ route, navigation }) => {
  const { category } = route.params; // Passed from CategoryList
  const dispatch = useDispatch();

  const [categoryName, setCategoryName] = useState(category.categoryName || "");
  const [categoryImage, setCategoryImage] = useState(category.image ? category.image.url : null);
  const { loading, success, error } = useSelector((state) => state.updateCategories);

  // Request permission and select image
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Permission to access media library is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setCategoryImage(result.assets[0].uri); // Set selected image URI
    }
  };

  // Handle updating the category
  const handleUpdateCategory = async () => {
    if (!categoryName.trim()) {
      Alert.alert("Validation Error", "Category name is required.");
      return;
    }
  
    const formData = new FormData();
    formData.append("categoryName", categoryName);
  
    // If image is selected and different from the current one
    if (categoryImage && categoryImage !== category.image?.url) {
      const filename = categoryImage.split("/").pop();
      const type = `image/${filename.split(".").pop()}`;
  
      
      const imageData = {
        uri: categoryImage,
        name: filename,
        type: type,
      };
  
     
      formData.append("image", {
        uri: categoryImage,
        name: filename,
        type: type,
      });
  
      // Log the appended image data
      console.log("Image Data being appended as File:", imageData);
    }
  
    // Log the complete FormData to verify the contents
    console.log("Form Data being sent:", formData);
  
    setLoading(true);
    try {
      await dispatch(categoryEdit(category._id, formData)); // Dispatch category edit action
      Alert.alert("Success", "Category updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating category:", error);
      Alert.alert("Error", "Failed to update category.");
    } finally {
      setLoading(false);
    }
  };
  

  // Log any state changes, such as errors or success
  console.log("Loading:", loading);
  console.log("Success:", success);
  console.log("Error:", error);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Category</Text>
      <Text style={styles.label}>Category Image</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {categoryImage ? (
          <Image source={{ uri: categoryImage }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Tap to select an image</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.label}>Category Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter category name"
        value={categoryName}
        onChangeText={setCategoryName}
      />
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleUpdateCategory}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#f5f5f5",
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  imagePlaceholder: {
    color: "#777",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditCategory;
