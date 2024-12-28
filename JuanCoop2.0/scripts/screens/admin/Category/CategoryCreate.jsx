import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Modal, ScrollView } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useDispatch,useSelector } from "react-redux";
import { categoryCreate } from "@redux/Actions/categoryActions";
const CategoryCreate = () => {
  const [categoryName, setCategoryName] = useState(""); 
  const [image, setImage] = useState(null); 
  const [mainImage, setMainImage] = useState(""); 
  const [modalVisible, setModalVisible] = useState(false); 
  const [errors, setErrors] = useState(""); 
  const dispatch = useDispatch(); 
  const category = useSelector(state => state.category);
  useEffect(() => {
    (async () => {
      const cameraRollStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraRollStatus.status !== "granted") {
        alert("Permission to access camera roll is required!");
      }
    })();
  }, []);

  const addImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setImage(selectedImageUri);
      setMainImage(selectedImageUri); // Correctly update the main image to display it
      setModalVisible(false); 
    }
  };

  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      aspect: [4, 3],
      quality: 0.1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);
      setMainImage(imageUri); // Correctly update the main image to display it
    }
  };

  const saveCategory = () => {
    if (!categoryName || !image) {
      setErrors("Please provide both category name and an image.");
      return;
    }
  
    const categoryData = {
      categoryName,
      image,
    };
  
    // Dispatch the categoryCreate action
    dispatch(categoryCreate(categoryData));
  
    setCategoryName("");
    setImage(null);
    setMainImage("");
    setErrors(""); // Clear errors after saving
  };
  
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Create New Category</Text>

        {/* Modal for image selection */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Choose an option to get an image:</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    takePicture();
                  }}
                >
                  <Ionicons name="camera-outline" style={{ fontSize: 30 }} />
                  <Text>Take Picture</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    addImage();
                  }}
                >
                  <Ionicons name="image-outline" style={{ fontSize: 30 }} />
                  <Text>Add Image</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{ marginTop: 5.5 }}
                >
                  <Text>CANCEL</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Category Image Upload */}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => setModalVisible(true)}
        >
          <View style={styles.uploadContent}>
            {mainImage ? (
              <Image
                style={styles.image}
                source={{ uri: mainImage }} // Display selected image
              />
            ) : (
              <FontAwesome
                name="photo"
                size={34}
                color="black"
                style={styles.uploadIcon}
              />
            )}
            <Text style={styles.uploadText}>Upload Category Image</Text>
          </View>
        </TouchableOpacity>

        {/* Category Name Input */}
        <TextInput
          placeholder="Category Name"
          style={styles.input}
          onChangeText={setCategoryName}
          value={categoryName}
        />

        {/* Error Message */}
        {errors && <Text style={styles.errorText}>{errors}</Text>}

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveCategory}
        >
          <Text style={styles.buttonText}>Save Category</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = {
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  container: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  uploadButton: {
    backgroundColor: '#f0f0f0',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  uploadContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: 40,
    color: '#666',
  },
  uploadText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
};

export default CategoryCreate;
