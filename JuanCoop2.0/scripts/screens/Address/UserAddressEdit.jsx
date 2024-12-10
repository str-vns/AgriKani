import React, { useState, useContext, useEffect, useRef, useCallback} from 'react';
import { View, TextInput, TouchableOpacity, Text, Button, Modal, ActivityIndicator, BackHandler  } from 'react-native';
import { FlatList } from "native-base";
import { useDispatch, useSelector } from 'react-redux';
import { reverseCode, forwardCode } from "@redux/Actions/locationActions";
import { updateAddress } from '@src/redux/Actions/addressActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from "@redux/Store/AuthGlobal";
import { WebView } from "react-native-webview";
import styles from "@screens/stylesheets/Address/addressForm";
import { useFocusEffect } from '@react-navigation/native';

const UserAddressEdit = ({ route, navigation }) => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const webViewRef = useRef(null);
  const { GeoLoading, location, GeoError } = useSelector((state) => state.Geolocation);
  const { addressData = {} } = route.params ;
  const userId = context?.stateUser?.userProfile?._id;
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [token, setToken] = useState("");
  const [markerCoordinate, setMarkerCoordinate] = useState({  lat: 14.5995,
    lng: 120.9842, });
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    city:  addressData?.city || "",
    barangay: addressData?.barangay || "",
    address:   addressData?.address || "",
    postalCode: addressData?.postalCode || "",
    latitude:  addressData?.latitude || "",
    longitude: addressData?.longitude || "",
  });

  
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

        if (addressData ) {
            setForm({ ...form, ...addressData });
        }  
        setMarkerCoordinate({ lat: addressData?.latitude , lng: addressData?.longitude });

    }, [addressData])
  )

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  useEffect(() => {
    if (location && location.address && location.position) {
      setForm({
        city: location.address.city,
        barangay: location.address.district,
        address: location.address.label,
        postalCode: location.address.postalCode,
        latitude: location.position.lat,
        longitude: location.position.lng,
      })
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
    setForm({
      city: aAddress.address.city,
      barangay: aAddress.address.district,
      address: aAddress.address.label,
      postalCode: aAddress.address.postalCode,
      latitude: aAddress.position.lat,
      longitude: aAddress.position.lng,
    })
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

  const handleSubmit = () => {
    const payload = { ...form, userId };
    setIsLoading(true);
    try {
        
        dispatch(updateAddress(payload, addressData._id));
        setIsLoading(false);
        setForm({city: '', barangay: '', address: '', postalCode: '', latitude: '', longitude: '' });
        navigation.goBack(); 
    } catch (error) {
        console.error("Error updating address: ", error);
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
  
  const handleBackPress = () => {

    setForm({ city: '', barangay: '', address: '', postalCode: '', latitude: '', longitude: '' });
    navigation.goBack();
    return true; 
  };

  useEffect(() => {
   
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);
  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Edit Address</Text>

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

      {['address', 'city', 'barangay','postalCode'].map((field, index) => (
        <TextInput
          key={index}
          placeholder={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          value={form[field]}
          onChangeText={(value) => handleChange(field, value)}
          style={styles.input}
          placeholderTextColor="#999"
        />
      ))}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        {isLoading ? ( <ActivityIndicator size="small" color="#fff" /> ) :  
        <Text style={styles.buttonText} disabled={isLoading} >Update Address</Text>}
    
      </TouchableOpacity>

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


export default UserAddressEdit;