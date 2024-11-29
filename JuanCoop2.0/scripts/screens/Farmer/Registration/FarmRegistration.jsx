import React, {  useCallback,  useContext,  useEffect,  useRef,  useState, } from "react";
import { View, Text, TextInput, TouchableOpacity,  StyleSheet, Image,  ScrollView,  Button,  Modal, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, UrlTile } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { reverseCode, forwardCode } from "@redux/Actions/locationActions";
import { FlatList } from "native-base";
import { registerCoop } from "@redux/Actions/coopActions";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import styles from "@screens/stylesheets/farmRegister";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "@redux/Store/AuthGlobal";

const FarmRegistration = ({ navigation }) => {
  const navigate = useNavigation();
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const draggingTimeout = useRef(null);
  const userInfo = context.stateUser?.userProfile?._id;
  const { GeoLoading, location, GeoError } = useSelector((state) => state.Geolocation);
  const { authentication } = useSelector((state) => state.Coop);
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
  const [previousLocation, setPreviousLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [token, setToken] = useState("");
  const [markerCoordinate, setMarkerCoordinate] = useState({ lat: 37.78825, lng: -122.4324, });
  const [mainImage, setMainImage] = useState("");

  //token
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

  //main Load
  useFocusEffect(
    useCallback(() => {
      const getCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMessage("Permission to access location was denied");
          return;
        }

        try {
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

          dispatch(reverseCode(latitude, longitude));
          setPreviousLocation({ latitude, longitude });
        } catch (error) {
          console.log("Error getting Location", error);
          setErrorMessage("Could not retrieve location. Please try again.");
        }
      };

      getCurrentLocation();
    }, []) // Empty array as dependencies, so it only runs on focus
  );

  //set send Info
  useEffect(() => {
    if (location && location.address && location.position) {
      setMyAddress(location.address.label);
      setBarangay(location.address.district);
      setCity(location.address.city);
      setPostalCode(location.address.postalCode);
      setLatitude(location.position.lat);
      setLongitude(location.position.lng);
    }
    if (GeoError) {
      setErrorMessage(GeoError);
    }
  }, [location, GeoError]);

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

  if (GeoError) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {GeoError}</Text>
      </View>
    );
  }

  const noLocations = !location || location.length === 0;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Check if the result is not canceled and has assets
    if (!result.canceled && result.assets && result.assets.length > 0) {
      // console.log(result);
      // Access the first asset for its URI
      const uri = result.assets[0].uri;

      // Update the state with the new image URI
      setMainImage((prevImages) => [...prevImages, uri]);
      setImage((prevImages) => [...prevImages, uri]);
    } else {
      console.log("No image selected or an error occurred.");
    }
  };

  const deleteImage = (index) => {
    setImage((prevImages) => prevImages.filter((_, i) => i !== index));
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
      farmName: farmName,
      address: myaddress,
      city: city,
      barangay: barangay,
      postalCode: postalCode,
      image: image,
      latitude: latitude,
      longitude: longitude,
      user: userInfo,
    };

    dispatch(registerCoop(coopRegistration, token));
    setFarmName("");
    setMyAddress("");
    setCity("");
    setBarangay("");
    setPostalCode("");
    setImage([]);
    setLatitude("");
    setLongitude("");
    setErrors(null);

    navigate.navigate("CoopDashboard");
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
      {/* <Text>{`Current Location: ${
        previousLocation
          ? `Lat: ${previousLocation.latitude}, Long: ${previousLocation.longitude}`
          : "Locating..."
      }`}</Text> */}
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.mapContainer}>
          {mapRegion && (
            <MapView style={styles.map} region={mapRegion} provider={null}>
              <UrlTile 
                urlTemplate="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maximumZ={19}
              />
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

        <Text style={styles.label}>{longitude}</Text>
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
          style={styles.input}
          placeholder="Enter Farm Address"
          value={myaddress}
          onChangeText={setMyAddress}
        />

        <Text style={styles.label}>Barangay</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Barangay"
          value={barangay}
          onChangeText={setBarangay}
        />

        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter City"
          value={city}
          onChangeText={setCity}
        />

        <Text style={styles.label}>Postal Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Postal Code"
          value={postalCode}
          onChangeText={setPostalCode}
          keyboardType="numeric"
        />

        {/* Image Picker */}
        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.selectImageButton}>Select Images</Text>
        </TouchableOpacity>

        <ScrollView horizontal>
          {image.map((imageUri, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.image} />
              <TouchableOpacity
                onPress={() => deleteImage(index)}
                style={styles.deleteButton}
              >
                <Ionicons name="close-outline" size={25} color="black" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {errors ? <Text style={styles.error}>{errors}</Text> : null}

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => handleRegisterFarm()}
        >
          <Text style={styles.registerButtonText}>Register Cooperative</Text>
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



export default FarmRegistration;
