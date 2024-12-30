import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as Location from 'expo-location'
import { WebView } from 'react-native-webview';
import { useSocket } from "../../../SocketIo";
import { getDeliveryTracking } from "@redux/Actions/deliveryActions";
import { useDispatch, useSelector } from "react-redux";


const UserTracking = (props) => {
  const webViewRef = useRef(null)
  const socket = useSocket();
  const dispatch = useDispatch()
  const navigation = useNavigation();
  const trackInfo = props.route.params.trackId;
  const { Deliveryloading ,deliveries, Deliveryerror } = useSelector((state) => state.deliveryList);
  const [markerCoordinate, setMarkerCoordinate] = useState({ lat: 37.78825, lng: -122.4324, });
  const [arrivedData, setArrivedData] = useState({});
 

  console.log("Delivery Info:", deliveries?.deliveryLocation);
   useFocusEffect(
    useCallback(() => {
        dispatch(getDeliveryTracking(trackInfo));
        setMarkerCoordinate({ lat: deliveries?.deliveryLocation?.Latitude , lng: deliveries?.deliveryLocation?.Longitude });
    }, [trackInfo])
   )



    useEffect(() => {
       socket.on('getDeliveryLocation', (data) => {
        console.log("Received delivery location:", data);
        setArrivedData({
            latitude: data.latitude,
            longitude: data.longitude,
            senderId: data.senderId,
            deliveryId: data.deliveryId,
            status: data.status,
          });
       })
       return () => {
         socket.off('getDeliveryLocation');
       };
     }, [socket]);


  useEffect(() => {
           if (webViewRef.current && markerCoordinate) {
             webViewRef.current.postMessage(JSON.stringify({markerCoordinate, arrivedData, deliveries}));
           }
  }, [markerCoordinate, arrivedData, deliveries]);

let mapHtml;

if (deliveries.status === "delivering") {
  mapHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no">
        <title>Leaflet Map</title>  

        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.1/dist/leaflet.css" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" rel="stylesheet">
        <script src="https://unpkg.com/leaflet@1.9.1/dist/leaflet.js"></script>
        <script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script>
        <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@3.2.1/dist/leaflet-routing-machine.css" />
        <script src="./lrm-esri.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { width: 100%; height: 100vh; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          // Initial locations
          let markerCoordinate = { lat: ${markerCoordinate.lat}, lng: ${markerCoordinate.lng} }; // Example for user's location
          const deliverInfo = {
            deliveryLocation: { Latitude: ${arrivedData?.latitude || 0}, Longitude: ${arrivedData?.longitude || 0} },
          };
          const deliveryLocation = deliverInfo?.deliveryLocation || { Latitude: 0, Longitude: 0 };

          // Initialize map
          const map = L.map('map').setView([markerCoordinate.lat, markerCoordinate.lng], 15);

          // Add tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);

          // Add user and delivery markers
          const userMarker = L.marker([markerCoordinate.lat, markerCoordinate.lng]).addTo(map);
          const deliveryMarker = L.marker([deliveryLocation.Latitude, deliveryLocation.Longitude]).addTo(map);

          // Initialize route control
          const routeControl = L.Routing.control({
            waypoints: [
              L.latLng(markerCoordinate.lat, markerCoordinate.lng),
              L.latLng(deliveryLocation.Latitude, deliveryLocation.Longitude),
            ],
            lineOptions: {
              styles: [{ color: 'blue', opacity: 0.8, weight: 5 }],
            },
            altLineOptions: {
              styles: [{ color: 'red', opacity: 0.8, weight: 2 }],
            },
            routeWhileDragging: false,
            showAlternatives: true,
            collapsible: true,
            position: 'bottomleft',
            show: false,
            useZoomParameter: true,
          }).addTo(map);

          // Function to update driver location
          function updateDriverLocation(newLat, newLng) {
            // Update marker position
            markerCoordinate = { lat: newLat, lng: newLng };
            userMarker.setLatLng([newLat, newLng]);

            // Update route
            routeControl.setWaypoints([
              L.latLng(markerCoordinate.lat, markerCoordinate.lng),
              L.latLng(deliveryLocation.Latitude, deliveryLocation.Longitude),
            ]);
          }
        </script>
      </body>
    </html>
  `;
} else {
  mapHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no">
        <title>Leaflet Map</title>  

        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.1/dist/leaflet.css" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" rel="stylesheet">
        <script src="https://unpkg.com/leaflet@1.9.1/dist/leaflet.js"></script>
        <script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script>
        <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@3.2.1/dist/leaflet-routing-machine.css" />
        <script src="./lrm-esri.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { width: 100%; height: 100vh; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          // Initial locations
          let markerCoordinate = { lat: ${markerCoordinate.lat}, lng: ${markerCoordinate.lng} }; // Example for user's location
          const deliverInfo = {
            deliveryLocation: { Latitude: ${arrivedData?.latitude || 0}, Longitude: ${arrivedData?.longitude || 0} },
          };
          const deliveryLocation = deliverInfo?.deliveryLocation || { Latitude: 0, Longitude: 0 };

          // Initialize map
          const map = L.map('map').setView([markerCoordinate.lat, markerCoordinate.lng], 15);

          // Add tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);

          // Add user and delivery markers
          const userMarker = L.marker([markerCoordinate.lat, markerCoordinate.lng]).addTo(map);
          const deliveryMarker = L.marker([deliveryLocation.Latitude, deliveryLocation.Longitude]).addTo(map);
        </script>
      </body>
    </html>
  `;
}
  
  const handleWebViewMessage = (event) => {
    const { data } = event.nativeEvent;
    try {
      const parsedData = JSON.parse(data);
      console.log("WebView message received:", parsedData);
    } catch (error) {
      console.error("Error parsing WebView message:", error);
    }
  };

const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "orange";
      case "delivering":
        return "blue";
      case "cancelled":
        return "red";
      case "re-deliver":
        return "purple";
      case "failed":
        return "gray";
      case "delivered":
        return "green";
      default:
        return "black"; 
    }
  };

  const capitalizeFirstLetter = (text) => {
    if (!text) return ""; 
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <View style={styles.container}>
    {Deliveryloading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFC107" />
        <Text style={styles.loadingText}>Loading delivery details...</Text>
      </View>
    ) : (
      <>
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
                {deliveries?.assignedTo?.firstName} {deliveries?.assignedTo?.lastName}
              </Text>
              {/* <Text style={styles.driverDetails}>4-door (Green SUV)</Text> */}
              <Text style={styles.driverPhone}>{deliveries?.assignedTo?.phoneNum}</Text>
              <Text style={styles.driverDetails}>Status: {""}
                <Text style={[styles.status, { color: getStatusColor(arrivedData.status || deliveries?.status) }]}>
                        {capitalizeFirstLetter(arrivedData.status || deliveries?.status)}
                  </Text>
                 </Text>
            </View>
          </View>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.dropOffButton}
              onPress={() => navigation.navigate("QrGenerate", { deliveryId: deliveries   })}>
              <Text style={styles.buttonText}>QR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    )}
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

export default UserTracking;
