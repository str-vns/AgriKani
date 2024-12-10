import React, {  useContext,  useEffect,  useRef,  useState, } from "react";
import { View, Text, TextInput, TouchableOpacity, Image,  ScrollView,  Button,  Modal, ActivityIndicator, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "native-base";
import { useDispatch, useSelector } from "react-redux";
import { reverseCode, forwardCode } from "@redux/Actions/locationActions";
import { registerCoop } from "@redux/Actions/coopActions";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import styles from "@screens/stylesheets/farmRegister";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { WebView } from "react-native-webview";


const FarmRegistration = ({ navigation }) => {
  const navigate = useNavigation();
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const webViewRef = useRef(null);
  const userInfo = context.stateUser?.userProfile?._id;
  const { GeoLoading, location, GeoError } = useSelector((state) => state.Geolocation);
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
  const [modalVisible, setModalVisible] = useState(false);
  const [token, setToken] = useState("");
  const [markerCoordinate, setMarkerCoordinate] = useState({  lat: 14.5995,
    lng: 120.9842, });
  const [mainImage, setMainImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    const getCurrentLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const { latitude, longitude } = location.coords;

        setMarkerCoordinate({ lat: latitude, lng: longitude });
        dispatch(reverseCode(latitude, longitude));
      } catch (error) {
        console.error("Error getting Location:", error);
      }
    };

    getCurrentLocation();
  }, []);

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
      return; // Stop execution if there's no address
    }
    // Dispatch the action and wait for the results
    dispatch(forwardCode(address));
    setErrorMessage("");
  };

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
      setMainImage(prevImages => [...prevImages, uri]);
      setImage(prevImages => [...prevImages, uri]);
    } else {
      console.log("No image selected or an error occurred.");
    }
  }

const deleteImage = (index) => {
    setImage(prevImages => prevImages.filter((_, i) => i !== index));
}

  const handleRegisterFarm = () => {
    setIsLoading(true);
    try
    {
      if(!farmName || !myaddress || !city || !barangay || !postalCode || !image.length) {
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
      }

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
  `


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
        originWhitelist={['*']}
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
          {isLoading ? (  <ActivityIndicator size="small" color="#fff" /> ) : (   <Text style={styles.registerButtonText}>Register Cooperative</Text>)}
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
