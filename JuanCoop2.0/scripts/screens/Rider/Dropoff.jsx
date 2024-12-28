import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as Location from 'expo-location'
import { WebView } from 'react-native-webview';
import { useSocket } from "../../../SocketIo";

const LocationDetails = (props) => {
  const webViewRef = useRef(null)
  const socket = useSocket();
  const deliverInfo = props.route.params.deliveryItem;
  const Locate = deliverInfo?.deliveryLocation;
  const navigation = useNavigation();
  const [markerCoordinate, setMarkerCoordinate] = useState({ lat: 37.78825, lng: -122.4324, });
  const [deliveryMarker, setDeliveryMarker] = useState(null);
  
  useEffect(() => {
    const getCurrentLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Permission to access location was denied');
        return;
      }

      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000, 
          distanceInterval: 3, 
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          setMarkerCoordinate({ lat: latitude, lng: longitude });

          socket.emit('deliveryLocationUpdate', { lat: latitude, lng: longitude });
        }
      );
      return () => {
        locationSubscription.remove();
      };
    };

    getCurrentLocation();
  }, []);
 

       
  useEffect(() => {
           if (webViewRef.current && markerCoordinate) {
             webViewRef.current.postMessage(JSON.stringify({markerCoordinate, Locate}));
           }
  }, [markerCoordinate, Locate]);


  const mapHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no">
    <title>Leaflet Map</title>  
      
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.1/dist/leaflet.css" />
    <link href="https://cdn.jsdelivr.net/npm/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" rel="stylesheet">
    <script src="https://unpkg.com/leaflet@1.9.1/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@3.2.1/dist/leaflet-routing-machine.css" />
    <script src="./lrm-esri.js"></script>
   <style>
      body { margin: 0; padding: 0; }
      #map { width: 100%; height: 100vh; } /* Set full height */
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      const markerCoordinate = { lat: ${markerCoordinate.lat}, lng:  ${markerCoordinate.lng} }; // Example for user's location
      const deliverInfo = {
        deliveryLocation: { Latitude: ${Locate.Latitude}, Longitude: ${Locate.Longitude} },
      };

      const deliveryLocation = deliverInfo?.deliveryLocation || { Latitude: 0, Longitude: 0 };

      const map = L.map('map').setView([markerCoordinate.lat, markerCoordinate.lng], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

      const userMarker = L.marker([markerCoordinate.lat, markerCoordinate.lng], { draggable: false }).addTo(map);
      const deliveryMarker = L.marker([deliveryLocation.Latitude, deliveryLocation.Longitude], { draggable: false }).addTo(map);
        const routeControl = L.Routing.control({
        waypoints: [
          L.latLng(markerCoordinate.lat, markerCoordinate.lng), 
          L.latLng(deliveryLocation.Latitude, deliveryLocation.Longitude), 
        ],
        show: false,
        showAlternatives: true,
         routeWhileDragging: true,
        routeProfile: 2 ,
        collapsible: true,
         routeWhileDragging: false,
        lineOptions: {
          styles: [{ color: 'blue', opacity: 0.8, weight: 5 }]
        },
        altLineOptions: {
          styles: [{ color: 'red', opacity: 0.8, weight: 2 }]
        },
        position: 'bottomleft',
      }).addTo(map);
    
    </script>
  </body>
</html>
  `
  const handleWebViewMessage = (event) => {
    const { data } = event.nativeEvent;
    try {
      const parsedData = JSON.parse(data);
      console.log("WebView message received:", parsedData);
    } catch (error) {
      console.error("Error parsing WebView message:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          originWhitelist={["*"]}
          source={{ html: mapHtml }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onMessage={handleWebViewMessage}
        />
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.driverInfoContainer}>
          <Ionicons name="person-circle-outline" size={40} color="#333" />
          <View style={styles.driverTextContainer}>
            <Text style={styles.driverName}>
              {deliverInfo?.assignedTo?.firstName} {deliverInfo?.assignedTo?.lastName}
            </Text>
            <Text style={styles.driverDetails}>4-door (Green SUV)</Text>
            <Text style={styles.driverPhone}>0902-867-711</Text>
          </View>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.dropOffButton}
            onPress={() => navigation.navigate("Riderlist")}
          >
            <Text style={styles.buttonText}>Failed</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropOffButton}>
            <Text style={styles.buttonText}>Re-deliver</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropOffButton}>
            <Text style={styles.buttonText}>Delivered</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  mapContainer: {
    flex: 1,
    backgroundColor: "#ddd",
    justifyContent: "center",
    width: "100%",
    height: Dimensions.get("window").height * 0.5,
  },

  mapPlaceholderText: {
    color: "#fff",
    fontSize: 16,
  },
  detailsContainer: {
    backgroundColor: "#fff",
    padding: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  driverInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  driverTextContainer: {
    marginLeft: 15,
  },
  driverName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  driverDetails: {
    fontSize: 14,
    color: "#555",
  },
  driverPhone: {
    fontSize: 14,
    color: "#888",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  messageButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  dropOffButton: {
    backgroundColor: "#FFC107",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default LocationDetails;
