
import React, {useEffect, useRef, useState, useContext, useCallback } from 'react'
import * as Location from 'expo-location'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import { allCoops } from "@redux/Actions/coopActions";
import styles from "@screens/stylesheets/User/UserDistance";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from "@redux/Store/AuthGlobal";
import MarkerIcon from "@assets/img/MarkerIcon.png";
import { View } from 'native-base';
import { Image, Text, TouchableOpacity } from 'react-native';

const UserDistance = () => {
    const { coops } = useSelector((state) => state.allofCoops);
    const markerCon = MarkerIcon
    const context = useContext(AuthGlobal);
    const webViewRef = useRef(null)
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [token, setToken] = useState(null);
    const [mapRegion , setMapRegion] = useState(null);
    const [markerCoordinate, setMarkerCoordinate] = useState({ lat: 37.78825, lng: -122.4324, });
    const [coopsMarker, setCoopsMarker] = useState(null);
    const [coopId, setCoopId] = useState(null);
    const filterCoops = coops?.filter((coop) => coop._id === coopId);
   console.log("FilterCoops", filterCoops)
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
        if (Array.isArray(coops) && coops.length === 0) {
            console.log(coops)
          coops.forEach(coop => {
            setCoopsMarker([coop.latitude, coop.longitude]);
          });
        }
      }, [coops]);

    useFocusEffect( 
      useCallback(() => {
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
            setMapRegion({
              latitude,
              longitude,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            });
    
            dispatch(allCoops());
          } catch (error) {
            console.error("Error getting Location:", error);
          }
        };
       
        getCurrentLocation();
      }, [])
    )
    // Html for WebView
    useEffect(() => {
        if (webViewRef.current && markerCoordinate) {
          webViewRef.current.postMessage(JSON.stringify({markerCoordinate, coops}));
        }
      }, [markerCoordinate, coops]);

  console.log("MarkerIcon", MarkerIcon)
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
    <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@3.2.1/dist/leaflet-routing-machine.css" />
    <style>
      body { margin: 0; padding: 0; }
      #map { position: absolute; top: 0; bottom: 0; width: 100%; height: 100vh; }
      .custom-icon {
        font-size: 35px;
        color: black;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
      }
         .leaflet-routing-container {
      font-size: 14px; 
      padding: 10px;   
      width: 300px;   
      height: auto;  
  }

  .leaflet-routing-container button {
      font-size: 12px; 
      padding: 5px 10px; 
      border-radius: 5px; 
  }

  .leaflet-routing-container.leaflet-bar {
      margin-top: 10px; 
      margin-left: 10px;
  }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.1/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-routing-machine@3.2.1/dist/leaflet-routing-machine.js"></script>
    <script>
      const coopLocations = ${JSON.stringify(coops)}; // Your dynamic coop locations
      const initialLat = ${markerCoordinate.lat}; // The initial marker coordinates
      const initialLng = ${markerCoordinate.lng};
      let routeControl;
      let currentDestination = null; 
      let currentId = null; 

      var map = L.map('map').setView([initialLat, initialLng], 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
       {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

      var marker = L.marker([initialLat, initialLng]).addTo(map);

      var customIcon = L.divIcon({
        className: 'custom-icon',
        html: '<i class="fa-solid fa-map-pin"></i>',
        iconSize: [32, 32], 
        iconAnchor: [10, 20]
      });

      coopLocations.forEach(coop => {
        const coopMarker = L.marker([coop.latitude, coop.longitude], { icon: customIcon })
          .addTo(map)
          .bindPopup('<b>' + coop.farmName + '</b><br>' + coop.address + '<br>');

        coopMarker.on('click', function(e) {
          currentDestination = e.target.getLatLng(); 
          currentId = coop._id; 
          routeControl.setWaypoints([L.latLng(initialLat, initialLng), currentDestination]);
          window.ReactNativeWebView.postMessage(JSON.stringify({ id: currentId }));
        });
      });

      routeControl = L.Routing.control({
              waypoints: [
                L.latLng(initialLat, initialLng),
                currentDestination, 
              ],
              show: false,
              useZoomParameter: true,
              collapsible: true,
              lineOptions: {
                styles: [{ color: 'blue', opacity: 0.8, weight: 5 }]
              },
              altLineOptions: {
                styles: [{ color: 'red', opacity: 0.8, weight: 2 }]
              },
              position: 'bottomleft',  
            }).addTo(map);

      map.on('click', function() {
        console.log('Map clicked, resetting route');
        window.ReactNativeWebView.postMessage(JSON.stringify({ id: null })); 
        
        if (routeControl) {
          routeControl.setWaypoints([L.latLng(initialLat, initialLng)]);
        }
      });

      var inactivityTimer;
      function resetMapPosition() {
        map.setView([initialLat, initialLng], 12);
        console.log("Map reset to initial position.");
      }


      map.on('moveend', function () {
        resetInactivityTimer();
      });

      function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(resetMapPosition, 10000); 
      }

      resetInactivityTimer();
    </script>
  </body>
</html>


  `

  const handleWebViewMessage = (event) => {
    const { data } = event.nativeEvent;
    console.log('Received data from WebView:', data);

    try {
      const parsedData = JSON.parse(data);
      console.log('Parsed message:', parsedData); 
      setCoopId(parsedData.id);

      if (parsedData.type === 'markerClick') {
        const { id } = parsedData;
        console.log("Marker clicked ID (React Native):", id); 
      }
    } catch (error) {
      console.error('Error handling WebView message:', error);
    }
  };

  const handleCoopProfile = (coop) => {
    navigation.navigate("Home", {
      screen: "CoopFarmProfile",
      params: { coop: coop },
    });
    setCoopId(null);
  }
  
  return (
    <View style={styles.overallContainer}>
    <View style={styles.mapContainer}>
        <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        javaScriptEnabled={true}
  domStorageEnabled={true}
        scrollEnabled={false}
        onMessage={handleWebViewMessage}
      />


    </View>
    {filterCoops && filterCoops.length > 0 ? (
  filterCoops.map((coop, index) => (
    <View style={styles.cardContainer} key={index}>
      <View style={styles.imageContainer}>
        <Image
          src={coop?.user?.image?.url}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.farmName} numberOfLines={2} ellipsizeMode="tail">
          {coop.farmName || "FARMNAME..."}
        </Text>
        <Text style={styles.address} numberOfLines={2} ellipsizeMode="tail">
          {coop.address || "No Address Available"}
        </Text>
      </View>

      <TouchableOpacity style={styles.viewButton} onPress={() =>
 handleCoopProfile(coop)}>
        <Text style={styles.buttonText}>View Profile</Text>
      </TouchableOpacity>
    </View>
  ))
) : (
  <View style={styles.cardContainer} >
     <View style={styles.detailContainerNull}>
      <Text style={styles.textNullDetail}>Click the Marker to Choose a Cooperative</Text>
     </View>

    </View>
)}
    
          </View>
  )
}

export default UserDistance
