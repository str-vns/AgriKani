import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../css/styles.js";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { categoryList } from "@redux/Actions/categoryActions";
import { typeList } from "@redux/Actions/typeActions";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { createCoopProducts } from "@redux/Actions/productActions";

const ProductCreate = ({ navigation }) => {
  const dispatch = useDispatch();
  const context = useContext(AuthGlobal);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [seletedTypes, setSeletedTypes] = useState([]);
  const [maxPurchase, setMaxPurchase] = useState("");
  const [price, setPrice] = useState(""); // Added price state
  const [image, setImage] = useState([]);
  const [token, setToken] = useState("");
  const [errorsmess, setErrorsMess] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [modalVisibleCat, setModalVisibleCat] = useState(false);
  const [modalVisibleType, setModalVisibleType] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loading, categories, error } = useSelector((state) => state.categories);
  const { typeLoading, types, TypeError } = useSelector((state) => state.types);
  const userInfo = context?.stateUser?.userProfile?._id;
  // console.log("Categories",categories)
  // console.log("Types",types)

  useFocusEffect(
    useCallback(() => {
      dispatch(categoryList());
      dispatch(typeList());
    }, [])
  );

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;

      setMainImage((prevImages) => [...prevImages, uri]);
      setImage((prevImages) => [...prevImages, uri]);
    } else {
      console.log("No image selected or an error occurred.");
    }
  };

  const deleteImage = (index) => {
    setImage((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const toggleCategory = (id, name) => {
    setSelectedCategories((prev) => {
      const isSelected = prev.some((selected) => selected.id === id);
      if (isSelected) {
        // Remove the category if it was previously selected
        return prev.filter((selected) => selected.id !== id);
      } else {
        // Add the new category with both _id and categoryName
        return [...prev, { id, name }];
      }
    });
  };

  const toggleType = (id, name) => {
    setSeletedTypes((prev) => {
      const isSelected = prev.some((selected) => selected.id === id);
      if (isSelected) {
        return prev.filter((selected) => selected.id !== id);
      } else {
        return [...prev, { id, name }];
      }
    });
  };

  const handleSaveProduct = () => {
    setIsLoading(true);
    if (!productName || !description || !image) {
      setErrorsMess("Please fill in all fields");
      return;
    }
    const productItem = {
      productName: productName,
      description: description,
      category: selectedCategories.map((category) => category.id),
      type: seletedTypes.map((type) => type.id),
      image: image,
      user: userInfo,
    };

    dispatch(createCoopProducts(productItem, token));
    setTimeout(() => {
      setProductName("");
      setDescription("");
      setImage([]);
      setSelectedCategories([]);
      setSeletedTypes([]);
      setIsLoading(false);
      navigation.navigate("ProductsList");
    }, 5000);

  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("ProductsList")}
        >
          <Ionicons name="arrow-back-outline" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Product</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          placeholder="Enter Product Name"
          value={productName}
          onChangeText={(text) => setProductName(text)}
          style={styles.input}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          placeholder="Enter Product Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />

        {/* <Text style={styles.label}>Unit of Measurement</Text>
        <TextInput
          placeholder="Enter Unit of Measurement"
          value={unit}
          onChangeText={setUnit}
          style={styles.input}
        /> */}

        <Text style={styled.label}>Select Categories</Text>
        <TouchableOpacity
          onPress={() => setModalVisibleCat(true)}
          style={styled.dropdown}
        >
          <Text style={styled.dropdownText}>
            {selectedCategories?.length > 0
              ? selectedCategories.map((category) => category.name).join(", ")
              : "Select Categories"}
          </Text>
        </TouchableOpacity>

        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisibleCat}
          onRequestClose={() => setModalVisibleCat(false)}
        >
          <View style={styled.modalBackground}>
            <View style={styled.modalContainer}>
              <ScrollView>
                <View style={styled.checkboxGrid}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category._id} // Use category._id as the key
                      onPress={() =>
                        toggleCategory(category._id, category.categoryName)
                      }
                      style={styled.checkboxContainer}
                    >
                      <View style={styled.checkbox}>
                        {selectedCategories.some(
                          (selected) => selected.id === category._id
                        ) && <View style={styled.checkboxTick} />}
                      </View>
                      <Text style={styled.checkboxLabel}>
                        {category.categoryName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <TouchableOpacity
                onPress={() => setModalVisibleCat(false)}
                style={styled.closeButton}
              >
                <Text style={styled.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Text style={styled.label}>Select Types</Text>
        <TouchableOpacity
          onPress={() => setModalVisibleType(true)}
          style={styled.dropdown}
        >
          <Text style={styled.dropdownText}>
            {seletedTypes?.length > 0
              ? seletedTypes.map((type) => type.name).join(", ")
              : "Select Types"}
          </Text>
        </TouchableOpacity>

        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisibleType}
          onRequestClose={() => setModalVisibleType(false)}
        >
          <View style={styled.modalBackground}>
            <View style={styled.modalContainer}>
              <ScrollView>
                <View style={styled.checkboxGrid}>
                  {types.map((type) => (
                    <TouchableOpacity
                      key={type._id} // Use category._id as the key
                      onPress={() => toggleType(type._id, type.typeName)}
                      style={styled.checkboxContainer}
                    >
                      <View style={styled.checkbox}>
                        {seletedTypes.some(
                          (selected) => selected.id === type._id
                        ) && <View style={styled.checkboxTick} />}
                      </View>
                      <Text style={styled.checkboxLabel}>{type.typeName}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <TouchableOpacity
                onPress={() => setModalVisibleType(false)}
                style={styled.closeButton}
              >
                <Text style={styled.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


        <TouchableOpacity onPress={pickImage}>
          <Text style={styled.selectImageButton}>Select Images</Text>
        </TouchableOpacity>

        <ScrollView horizontal>
          {image.map((imageUri, index) => (
            <View key={index} style={styled.imageContainer}>
              <Image source={{ uri: imageUri }} style={styled.image} />
              <TouchableOpacity
                onPress={() => deleteImage(index)}
                style={styled.deleteButton}
              >
                <Ionicons name="close-outline" size={25} color="black" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        {errorsmess ? <Text style={styled.error}>{errorsmess}</Text> : null}
      
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProduct} disabled={isLoading}>
        {isLoading ? <ActivityIndicator size="small" color="#fff" /> :  <Text style={styles.saveButtonText}>Save Product</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styled = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  dropdown: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  dropdownText: {
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    maxHeight: "80%", // Limits height to avoid exceeding screen
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    overflow: "hidden", // Ensures content stays within bounds
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxTick: {
    width: 12,
    height: 12,
    backgroundColor: "#000",
  },
  checkboxLabel: {
    marginLeft: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  checkboxGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginVertical: 5,
  },
  selectImageButton: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  imageContainer: {
    position: "relative",
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 5,
  },
  error: {
    color: "red",
  },
});

export default ProductCreate;
