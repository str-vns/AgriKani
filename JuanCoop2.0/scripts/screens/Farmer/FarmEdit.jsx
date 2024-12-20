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
  Image,
  ScrollView,
  Button,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { reverseCode, forwardCode } from "@redux/Actions/locationActions";
import { FlatList } from "native-base";
import * as ImagePicker from "expo-image-picker";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { getCoop } from "@redux/Actions/productActions";
import { deleteCoopImage, UpdateCoop } from "@redux/Actions/coopActions";
import { WebView } from "react-native-webview";
import styles from "@screens/stylesheets/Coop/CoopFolderdes/FarmEdit";

const FarmRegistration = ({ navigation }) => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const webViewRef = useRef(null);
  const { GeoLoading, location, GeoError } = useSelector(
    (state) => state.Geolocation
  );
  const { coop } = useSelector((state) => state.singleCoop);
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
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newImage, setNewImage] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [token, setToken] = useState("");
  const [markerCoordinate, setMarkerCoordinate] = useState({
    lat: 14.5995,
    lng: 120.9842,
  });

  //Token
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
    setMarkerCoordinate({ lat: coop?.latitude, lng: coop?.longitude });
    dispatch(reverseCode(coop?.latitude, coop?.longitude));
  }, [coop]);

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

  useEffect(() => {
    if (webViewRef.current && markerCoordinate) {
      webViewRef.current.postMessage(JSON.stringify(markerCoordinate));
    }
  }, [markerCoordinate]);

  const handleMarkerDragEnd = (event) => {
    const { lat, lng } = JSON.parse(event.nativeEvent.data);
    setMarkerCoordinate({ lat, lng });
    dispatch(reverseCode(lat, lng));
  };

  const handleAddressSelect = (result) => {
    const aAddress = result;
    const locations = result.position;
    setMarkerCoordinate(locations);

    setAddress("");
    setMyAddress(aAddress.address.label);
    setBarangay(aAddress.address.district);
    setCity(aAddress.address.city);
    setPostalCode(aAddress.address.postalCode);
    setLatitude(aAddress.position.lat);
    setLongitude(aAddress.position.lng);
    setModalVisible(false);
  };

  const forwardGeoCode = async () => {
    if (address === "") {
      setErrorMessage("Please enter an address to search");
      return;
    }
    dispatch(forwardCode(address));
    setErrorMessage("");
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImages = [];
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

  const deleteImage = (imageId, index) => {
    setImage((prevImages) => prevImages.filter((_, i) => i !== index));
    dispatch(deleteCoopImage(farmId, imageId));
  };

  const handleRegisterFarm = () => {
    setIsLoading(true);
    try {
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
        address: myaddress,
        city,
        barangay: barangay,
        postalCode,
        latitude,
        longitude,
        image: newImage,
        id: farmId,
      };

      dispatch(UpdateCoop(coopRegistration, token));
      setFarmName("");
      setImage([]);
      setNewImage([]);
      setErrors("");
      setIsLoading(false);
      navigation.navigate("Profile");
    } catch (error) {
      console.error("Error registering farm: ", error);
      setErrors("Error registering farm. Please try again.");
      setIsLoading(false);
    }
  };

  const mapHtml = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no">
    <title>Leaflet Map with Draggable Markers</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.1/dist/leaflet.css" />
    <style>
      body { margin: 0; padding: 0; }
      #map { position: absolute; top: 0; bottom: 0; width: 100%; height: 100vh; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.1/dist/leaflet.js"></script>
    <script>
      const initialLat = ${markerCoordinate.lat};
      const initialLng = ${markerCoordinate.lng};

      var map = L.map('map').setView([initialLat, initialLng], 19);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      var marker = L.marker([initialLat, initialLng], { 
        draggable: true,
      }).addTo(map);

      var inactivityTimer;
      function resetMapPosition() {
        map.setView([initialLat, initialLng], 19);
        console.log("Map reset to initial position.");
      }

      marker.on('dragend', function (e) {
        var newLatLng = e.target.getLatLng();
        window.ReactNativeWebView.postMessage(JSON.stringify({ lat: newLatLng.lat, lng: newLatLng.lng }));
        resetInactivityTimer();
      });

      map.on('moveend', function () {
        // Reset inactivity timer each time the map is moved
        resetInactivityTimer();
      });

      function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(resetMapPosition, 5000); 
      }

      resetInactivityTimer();
    </script>
  </body>
</html>
  `;

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

      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          originWhitelist={["*"]}
          source={{ html: mapHtml }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onMessage={handleMarkerDragEnd}
          scrollEnabled={false}
        />
        <Button title="Search Location" onPress={() => setModalVisible(true)} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.label}>Coop Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Farm Name"
          value={farmName}
          onChangeText={setFarmName}
        />

        <Text style={styles.label}>Coop Address</Text>
        <TextInput
          style={[
            styles.input,
            {
              textAlign: "left",
              paddingLeft: 10,
              paddingRight: 10,
              fontSize: 16,
            },
          ]}
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
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Update Cooperative</Text>
          )}
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
                {GeoLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.searchButtonText}>🔍</Text>
                )}
              </TouchableOpacity>
            </View>
            {errorMessage ? (
                <View style={styles.errorContainer}> 
              <Text style={styles.error}>{errorMessage}</Text>
              </View>
            ) : null}

            {GeoError ? (
              <>
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
