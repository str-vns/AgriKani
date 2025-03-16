import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { categoryCreate } from "@redux/Actions/categoryActions";
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const CategoryCreate = ({ token }) => {
  const [categoryName, setCategoryName] = useState("");
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const categoryState = useSelector((state) => state.createCategories);
  const navigation = useNavigation();

  // Function to pick an image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImageUri = "file:///" + result.assets[0].uri.split("file:/").join("");
      setImage({
        uri: newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri.split("/").pop(),
      });
    }
  };

  
  const handleSubmit = async () => {
    if (!image || !categoryName) {
      alert("Please select an image and enter a category name.");
      return;
    }
    
    if (categoryState.success) {
      alert("Category created successfully!");
      navigation.goBack(); // Ensure 'CategoryList' is the correct screen name
    }

    dispatch(categoryCreate({ categoryName }, image, token));
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Navigation */}
      {/* <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Category</Text>
      </View> */}

      {categoryState.error && <Text style={styles.error}>{categoryState.error}</Text>}
      
      <Text style={styles.label}>Category Name:</Text>
      <TextInput
        value={categoryName}
        onChangeText={setCategoryName}
        style={styles.input}
        placeholder="Enter category name"
      />

      <Text style={styles.label}>Category Image:</Text>
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>Choose Image</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image.uri }} style={styles.preview} />}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Category</Text>
      </TouchableOpacity>
    </View>
  );
};

// **Styles**
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
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  imageButton: {
    backgroundColor: "#8f8e8b",
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  imageButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  preview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FEC120",
    padding: 14,
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  success: {
    color: "green",
    textAlign: "center",
    marginBottom: 10,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default CategoryCreate;
