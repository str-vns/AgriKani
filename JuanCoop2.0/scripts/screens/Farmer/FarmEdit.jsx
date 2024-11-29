import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Button,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { reverseCode, forwardCode } from "@redux/Actions/locationActions";
import { FlatList } from "native-base";
import * as ImagePicker from "expo-image-picker";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { registerCoop } from "@redux/Actions/coopActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getCoop } from "@redux/Actions/productActions";
import { deleteCoopImage, UpdateCoop } from "@redux/Actions/coopActions";

const FarmRegistration = ({ navigation }) => {
  const navigate = useNavigation();
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const { loading, location, error } = useSelector((state) => state.Lokication);
  const { coop } = useSelector((state) => state.singleCoop);
  const { authentication } = useSelector((state) => state.Coop);
  const userInfo = context.stateUser?.userProfile?._id;
  const farmId = coop?._id;
  const [farmName, setFarmName] = useState("");
  const [address, setAddress] = useState("");
  const [myaddress, setMyAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [barangay, setBarangay] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [image, setImage] = useState([]);
  const [coordinates, setCoordinates] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState(null);
  const [newImage, setNewImage] = useState([]);
  const [previousLocation, setPreviousLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [token, setToken] = useState("");
  const [markerCoordinate, setMarkerCoordinate] = useState({
    lat: 37.78825,
    lng: -122.4324,
  });
  const draggingTimeout = useRef(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const getCurrentLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMessage("Permission to access location was denied");
        return;
      }
      // Retrieve and set the current location
      const locations = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = locations.coords;
      setMarkerCoordinate({ lat: latitude, lng: longitude });
      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      });
      dispatch(reverseCode(latitude, longitude)); // Fetch address based on coordinates
    };
    getCurrentLocation();
  }, []);

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

  useFocusEffect(
    useCallback(() => {
      if (userInfo) {
        dispatch(getCoop(userInfo));
      }
    }, [userInfo])
  );
  console.log(coop.image);
  useEffect(() => {
    if (coop) {
      setFarmName(coop?.farmName);
      setMyAddress(coop?.address);
      setBarangay(coop?.barangay);
      setCity(coop?.city);
      setPostalCode(coop?.postalCode);
      setLatitude(coop?.latitude);
      setLongitude(coop?.longitude);
      setImage(
        Array.isArray(coop?.image)
          ? coop.image
          : coop?.image?.url
          ? [{ url: coop.image.url }]
          : []
      );
    }
  }, [coop]);

  const handleAddressSelect = (result) => {
    const aAddress = result;
    const locations = result.position;
    setMarkerCoordinate(locations);
    setCoordinates(locations);
    setMapRegion({
      latitude: locations.lat,
      longitude: locations.lng,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
    });
    // setErrorMessage(`Selected Location:\nLatitude: ${location.lat}\nLongitude: ${location.lng}`);
    setAddress("");
    setMyAddress(aAddress.address.label);
    setBarangay(aAddress.address.district);
    setCity(aAddress.address.city);
    setPostalCode(aAddress.address.postalCode);
    setLatitude(aAddress.position.lat);
    setLongitude(aAddress.position.lng);
    setModalVisible(false);
  };

  const handleMarkerDrag = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerCoordinate({ lat: latitude, lng: longitude });
    if (draggingTimeout.current) {
      clearTimeout(draggingTimeout.current);
    }
    draggingTimeout.current = setTimeout(() => {
      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      });
    }, 2000);
  };

  const handleMarkerDragEnd = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    dispatch(reverseCode(latitude, longitude));
  };

  const forwardGeoCode = async () => {
    if (address === "") {
      setErrorMessage("Please enter an address to search");
      return; // Stop execution if there's no address
    }
    // Dispatch the action and wait for the results
    dispatch(forwardCode(address));
    setErrorMessage("");
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  const noLocations = !location || location.length === 0;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImages = [];
      result.assets.forEach((asset) => {
        // Check for duplicates and add only if not found
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

  const deleteImage = (imageId, index) => {
    setImage((prevImages) => prevImages.filter((_, i) => i !== index));
    dispatch(deleteCoopImage(farmId, imageId)); // Ensure correct imageId is passed here
  };

  const handleRegisterFarm = () => {
    if (
      !farmName ||
      !myaddress ||
      !city ||
      !barangay ||
      !postalCode ||
      !image.length
    ) {
      setErrors("Please fill in all fields and select an image");
      return;
    }

    const coopRegistration = {
      farmName,
      image: newImage,
      id: farmId,
    };

    dispatch(UpdateCoop(coopRegistration, token)); 
    setFarmName("");
    setImage([]); 
    setNewImage([]);
    setErrors("")
    navigation.navigate('Profile'); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Farm Registration</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.mapContainer}>
          {mapRegion && (
            <MapView style={styles.map} region={mapRegion}>
              <Marker
                coordinate={{
                  latitude: markerCoordinate.lat,
                  longitude: markerCoordinate.lng,
                }}
                draggable
                onDrag={handleMarkerDrag}
                onDragEnd={handleMarkerDragEnd}
              />
            </MapView>
          )}
        </View>

        <Button title="Search Location" onPress={() => setModalVisible(true)} />

        <Text style={styles.label}>Coop Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Farm Name"
          value={farmName}
          onChangeText={setFarmName}
        />

        <Text style={styles.label}>Coop Address</Text>
        <TextInput
           style={[styles.input, { textAlign: 'left', paddingLeft: 10, paddingRight: 10, fontSize: 16 }]}
          placeholder="Enter Farm Address"
          value={myaddress}
          onChangeText={setMyAddress}
          editable={false} 
        />

        <Text style={styles.label}>Barangay</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Barangay"
          value={barangay}
          onChangeText={setBarangay}
          editable={false} 
        />

        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter City"
          value={city}
          onChangeText={setCity}
          editable={false} 
        />

        <Text style={styles.label}>Postal Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Postal Code"
          value={postalCode}
          onChangeText={setPostalCode}
          keyboardType="numeric"
          editable={false} 
        />

        {/* Image Picker */}
        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.selectImageButton}>Select Images</Text>
        </TouchableOpacity>

        <ScrollView horizontal>
          {image.length > 0 &&
            image.map((imageItem, index) => {
              const imageUrl = imageItem.url || imageItem;
              return (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: imageUrl }} style={styles.image} />
                  <TouchableOpacity
                    onPress={() => deleteImage(imageItem._id, index)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="close-outline" size={25} color="black" />
                  </TouchableOpacity>
                </View>
              );
            })}
        </ScrollView>

        {errors ? <Text style={styles.error}>{errors}</Text> : null}

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => handleRegisterFarm()}
        >
          <Text style={styles.registerButtonText}>Update Cooperative</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Search Address</Text>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Type to search..."
                value={address}
                onChangeText={(text) => setAddress(text)}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={forwardGeoCode}
              >
                <Text style={styles.searchButtonText}>🔍</Text>
              </TouchableOpacity>
            </View>
            {errorMessage ? (
              <Text style={styles.error}>{errorMessage}</Text>
            ) : null}

            {noLocations ? (
              <>
                <Text>No locations found</Text>
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </>
            ) : (
              <>
                {location.length > 0 && (
                  <FlatList
                    data={location}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => handleAddressSelect(item)}
                      >
                        <Text style={styles.resultItem}>
                          {item.address.label}
                        </Text>
                      </TouchableOpacity>
                    )}
                    style={[styles.resultsList, { maxHeight: 200 }]}
                  />
                )}
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContainer: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    elevation: 3,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    fontSize: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  imagePicker: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  imagePickerText: {
    fontSize: 16,
    color: "#333",
  },
  mapContainer: {
    height: 250,
    marginTop: 20,
    borderRadius: 10,
    overflow: "hidden",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  registerButton: {
    backgroundColor: "#FEC120",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonText: {
    fontSize: 22,
    color: "#000",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    width: "80%",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  searchButton: {
    marginLeft: 8,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  resultsList: {
    marginTop: 10,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  error: {
    color: "red",
  },
  selectImageButton: {
    // Add styles for your button here
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  imageContainer: {
    position: "relative", // Enables absolute positioning of children
    marginRight: 10, // Space between images
  },
  image: {
    width: 100, // Adjust this value for larger images
    height: 100, // Adjust this value for larger images
    borderRadius: 8, // Optional: for rounded corners
    overflow: "hidden", // Ensures rounded corners are applied to the image
  },
  deleteButton: {
    position: "absolute",
    top: 5, // Distance from the top of the image
    right: 5, // Distance from the right of the image
    backgroundColor: "white", // Optional: background color for better visibility
    borderRadius: 12, // Optional: rounded button
    padding: 5, // Space around the icon
  },
});

export default FarmRegistration;
