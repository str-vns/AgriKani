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
import mime from "mime"; // Import mime for correct file type handling
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";



const EditCategory = ({ route, navigation }) => {
  const { category } = route.params; // Passed from CategoryList
  const dispatch = useDispatch();
  
  const { loading, success, error } = useSelector((state) => state.updateCategories);

  const [categoryName, setCategoryName] = useState(category.categoryName || "");
  const [categoryImage, setCategoryImage] = useState(category.image ? category.image.url : null);
  const [loadingState, setLoading] = useState(false); // Fix: Declare setLoading state

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
  
    const categoryData = { categoryName };
  
    let imageData = null;
    if (categoryImage && categoryImage !== category.image?.url) {
      const newImageUri = "file:///" + categoryImage.split("file:/").join(""); // Fix file path
      imageData = {
        uri: newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri.split("/").pop(),
      };
    }
  
    console.log("🚀 Updating category:", categoryData, imageData);
  
    setLoading(true);
    try {
      await dispatch(categoryEdit(category._id, categoryData, imageData, "your_token_here"));
      Alert.alert("Success", "Category updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("❌ Error updating category:", error);
      Alert.alert("Error", "Failed to update category.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
       <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Category</Text>
      </View>
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
        disabled={loadingState}
      >
        {loadingState ? (
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
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
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
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#f5f5f5",
    width: 200,
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
