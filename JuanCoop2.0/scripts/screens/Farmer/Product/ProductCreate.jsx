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
import styled from "@screens/stylesheets/Product/ProductedCreate";
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
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [seletedTypes, setSeletedTypes] = useState([]);
  const [image, setImage] = useState([]);
  const [token, setToken] = useState("");
  const [errorsmess, setErrorsMess] = useState("");
  const [newImage, setNewImage] = useState([]);
  const [modalVisibleCat, setModalVisibleCat] = useState(false);
  const [modalVisibleType, setModalVisibleType] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loading, categories, error } = useSelector(
    (state) => state.categories
  );
  const { typeLoading, types, TypeError } = useSelector((state) => state.types);
  const userInfo = context?.stateUser?.userProfile?._id;

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

  console.log("setImage", image);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImages = [];
      console.log("Image selected: ", result.assets);
      result.assets.forEach((asset) => {
        if (!image.some((existingImage) => existingImage.uri === asset.uri)) {
          newImages.push(asset.uri);
        }
      });

      setImage([...image, ...newImages]);
      setNewImage(newImages);
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
        return prev.filter((selected) => selected.id !== id);
      } else {
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
    <View style={styled.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styled.trikyHeader}>
          <Text style={styled.labelText}>Name</Text>
          <TextInput
            placeholder="Enter Product Name"
            value={productName}
            onChangeText={(text) => setProductName(text)}
            style={styled.input}
          />

          <Text style={styled.labelText}>Description</Text>
          <TextInput
            placeholder="Enter Product Description"
            value={description}
            onChangeText={setDescription}
            style={styled.input}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />

          <View style={styled.InputPosition}>
            <Text style={styled.labelText}>Select Categories</Text>
            <TouchableOpacity
              onPress={() => setModalVisibleCat(true)}
              style={styled.dropdown}
            >
              <Text style={styled.dropdownText}>
                {selectedCategories?.length > 0
                  ? selectedCategories
                      .map((category) => category.name)
                      .join(", ")
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
                          key={category._id}
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
          </View>
          <View style={styled.InputPosition}>
            <Text style={styled.labelText}>Select Types</Text>
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
                          key={type._id}
                          onPress={() => toggleType(type._id, type.typeName)}
                          style={styled.checkboxContainer}
                        >
                          <View style={styled.checkbox}>
                            {seletedTypes.some(
                              (selected) => selected.id === type._id
                            ) && <View style={styled.checkboxTick} />}
                          </View>
                          <Text style={styled.checkboxLabel}>
                            {type.typeName}
                          </Text>
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
          </View>

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

          <TouchableOpacity
            style={styled.saveButton}
            onPress={handleSaveProduct}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styled.saveButtonText}>Save Product</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductCreate;
