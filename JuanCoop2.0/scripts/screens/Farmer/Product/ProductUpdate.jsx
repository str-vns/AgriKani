import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Modal
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../css/styles.js";
import { useDispatch, useSelector } from "react-redux";
import { categoryList } from "@redux/Actions/categoryActions";
import { typeList } from "@redux/Actions/typeActions";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { updateCoopProducts, imageDel } from "@src/redux/Actions/productActions";


const ProductUpdate = (props) => {
  const singleProduct = props.route.params.item;
  const dispatch = useDispatch();
  const context = useContext(AuthGlobal);
  const navigation = useNavigation();

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState([]);
  const [token, setToken] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [errorsmess, setErrorsMess] = useState("");
  const [newImage, setNewImage] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [modalVisibleCat, setModalVisibleCat] = useState(false);
  const [modalVisibleType, setModalVisibleType] = useState(false);

  const { categories } = useSelector((state) => state.categories);
  const { types } = useSelector((state) => state.types);
  const userInfo = context?.stateUser?.userProfile?._id;
  const productId = singleProduct?._id;

  useEffect(() => {
    const loadProductData = () => {
      const matchingCats = categories.filter((cat) => singleProduct.category.includes(cat._id));
      setSelectedCategories(matchingCats.map((cat) => ({ id: cat._id, name: cat.categoryName })));

      const matchingTypes = types.filter((type) => singleProduct.type.includes(type._id));
      setSelectedTypes(matchingTypes.map((type) => ({ id: type._id, name: type.typeName })));

      const imageURLs = singleProduct.image.map((imageObj) => imageObj.url);
      setImage(imageURLs);
    };

    if (singleProduct) {
      loadProductData();
    }
    setProductName(singleProduct.productName);
    setDescription(singleProduct.description);
    setStock(singleProduct.stock.toString());
    setPrice(singleProduct.pricing.toString());
  }, [singleProduct, categories, types]);

  useFocusEffect(
    useCallback(() => {
      dispatch(categoryList());
      dispatch(typeList());
    }, [dispatch])
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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true, 
      aspect: [4, 3],
      quality: 1,

    });
  
    if (!result.canceled
   && result.assets && result.assets.length > 0) {
      const newImages = [];
      result.assets.forEach((asset) => {
        // Check for duplicates and add only if not found
        if (!image.some(existingImage => existingImage.uri === asset.uri)) {
          newImages.push(asset.uri);
        }
      });
  
      // Update the state with the new images, merging with existing ones
      setImage([...image, ...newImages]);
      setNewImage(newImages);
    } else {
      console.log("No image selected or an error occurred.");
    }
  };

  const deleteImage = (imageId, index) => {
    setImage((prevImages) => prevImages.filter((_, i) => i !== index));
    dispatch(imageDel(productId, imageId)); // Ensure correct imageId is passed here
  };

  const toggleCategory = (categoryId, categoryName) => {
    setSelectedCategories((prevSelected) => {
      const isSelected = prevSelected.some((selected) => selected.id === categoryId);
      return isSelected
        ? prevSelected.filter((selected) => selected.id !== categoryId)
        : [...prevSelected, { id: categoryId, name: categoryName }];
    });
  };

  const toggleType = (typeId, typeName) => {
    setSelectedTypes((prev) => {
      const isSelected = prev.some((selected) => selected.id === typeId);
      return isSelected
        ? prev.filter((selected) => selected.id !== typeId)
        : [...prev, { id: typeId, name: typeName }];
    });
  };

  const handleUpdateProduct = async () => {
    if (!productName || !description || !stock || !price || image.length === 0) {
      setErrorsMess("Please fill in all fields");
      return;
    }

    const productItem = {
      productName,
      description,
      stock: parseInt(stock),
      category: selectedCategories.map((cat) => cat.id),
      type: selectedTypes.map((type) => type.id),
      pricing: price,
      image: newImage,
    };

    try {
      dispatch(updateCoopProducts(productId, productItem, token));
      setTimeout(() => {
        setProductName("");
        setDescription("");
        setStock("");
        setPrice("");
        setSelectedCategories([]);
        setSelectedTypes([]);
        setErrorsMess("");
        setNewImage([])
        setImage([]);
        navigation.navigate("ProductsList");
      }, 5000);
    } catch (error) {
      console.error("Error updating product:", error);
      setErrorsMess("Failed to update product. Please try again.");
    }
  };

  const backButton = () => {
    navigation.navigate("ProductsList");
    setNewImage([])
    setImage([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => backButton()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Product</Text>
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
          onChangeText={(text) => setDescription(text)}
          style={styles.input}
        />

        <Text style={styles.label}>Stock</Text>
        <TextInput
          placeholder="Enter Product Stock"
          value={stock}
          name='stock'
          id='stock'
          keyboardType={"numeric"}
          onChangeText={(text) => setStock(text)}
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
            {selectedCategories.length > 0
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
            {selectedTypes.length > 0
              ? selectedTypes.map((type) => type.name).join(", ")
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
                        {selectedTypes.some(
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

        <Text style={styles.label}>Price</Text>
        <TextInput
          placeholder="Enter Product Price"
          value={price}
          keyboardType={"numeric"}
          onChangeText={(text) => setPrice(text)}
          style={styles.input}
        />

        <TouchableOpacity onPress={pickImage}>
          <Text style={styled.selectImageButton}>Select Images</Text>
        </TouchableOpacity>

        <ScrollView horizontal>
        {image.length > 0 && image.map((imageUri, index) => {
  const imageId = props.route.params.item.image[index]?._id; // Get the _id corresponding to the current image
  return (
    <View key={index} style={styled.imageContainer}>
      <Image source={{ uri: imageUri }} style={styled.image} />
      <TouchableOpacity
        onPress={() => deleteImage(imageId, index)} // Pass the _id and the index to the delete function
        style={styled.deleteButton}
      >
        <Ionicons name="close-outline" size={25} color="black" />
      </TouchableOpacity>
    </View>
  );
})}
        </ScrollView>
        {errorsmess ? <Text style={styled.error}>{errorsmess}</Text> : null}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => handleUpdateProduct()}
        >
          <Text style={styles.saveButtonText}>Update Product</Text>
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

export default ProductUpdate;
