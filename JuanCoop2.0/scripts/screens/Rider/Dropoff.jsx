import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Button,
  Modal,
  BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from 'expo-location'
import { useSocket } from "../../../SocketIo";
import { fetchRoute } from "@redux/Actions/locationActions";
import { updateDeliveryStatus } from "@redux/Actions/deliveryActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import AuthGlobal from "@redux/Store/AuthGlobal";
import MapboxGL from '@rnmapbox/maps'
import Constants from "expo-constants";

const LocationDetails = (props) => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const { RouteLoading, routes, RouteError } = useSelector((state) => state.MapBoxRoute);
  const deliverInfo = props.route.params.deliveryItem;
  const Locate = deliverInfo?.deliveryLocation;
  const user = context?.stateUser?.userProfile;
  const [markerCoordinate, setMarkerCoordinate] = useState({ latitude: 14.5995, longitude: 120.9842, });
  const [token, setToken] = useState(null);
  const [routeFetched, setRouteFetched] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(14);
  
  MapboxGL.setAccessToken(Constants.expoConfig?.extra?.MAPBOX_API_KEY);

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
  },[])

   useEffect(() => {
  
      if (!user?._id) {
        console.warn("User ID is missing.");
        return; 
      }
    
      if (!socket) {
        console.warn("Socket is not initialized.");
        return; 
      }
    
      socket.emit("addUser", user._id);
    
      socket.on("getUsers", (users) => {
        const onlineUsers = users.filter(
          (user) => user.online && user.userId !== null
        );
    
        setOnlineUsers(onlineUsers);
      });
    
      return () => {
        socket.off("getUsers");
      };
    }, [socket, user?._id]);

  const failedDelivery = () => {
    // dispatch(updateDeliveryStatus(deliverInfo._id, "failed" , token))
    // setCurrentRoute(null);
    navigation.navigate("Rider_Cancelled", { deliveryId: deliverInfo._id, userId: deliverInfo?.userId?._id  });
  };

  const reDeliver = () => {
    dispatch(updateDeliveryStatus(deliverInfo._id, "pending" , token))
    setCurrentRoute(null);
    navigation.navigate("Deliveries");
  };

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
          distanceInterval: 1, 
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          setMarkerCoordinate({ latitude, longitude });
    
          socket.emit('deliveryLocationUpdate', { lat: latitude, lng: longitude, status: deliverInfo.status,
             receiverId: deliverInfo.userId._id, senderId: deliverInfo.assignedTo.userId, deliveryId: deliverInfo._id, currentRoute: currentRoute });
        }

      );
      return () => {
        locationSubscription.remove();
      };
    };

    getCurrentLocation();
  }, [currentRoute]);
 
 const handleChangeRoute = async () => {
    if (!routeFetched) {
        const destination = {
            lat: Locate.Latitude,
            long: Locate.Longitude,
        };

        try {
            dispatch(fetchRoute(destination, markerCoordinate))
            setIsModalVisible(true)
        } catch (error) {
            console.error('Error fetching route:', error);
        }
    }
  }

  const handleSelectRoute = (selectedRoute) => {
    setCurrentRoute(selectedRoute);
    setIsModalVisible(false);  
  };

  const safeAlternateRoutes = Array.isArray(routes) && routes?.length > 0 ? routes : [];

  const convertSecondsToTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
  
    return `${hrs > 0 ? `${hrs}h ` : ''}${mins > 0 ? `${mins}m ` : ''}${secs > 0 ? `${secs}s` : ''}`.trim();
  };

  const handleZoomIn = () => {
    setZoomLevel(15); 
  };

  useEffect(() => {

  
    const backAction = () => {
      setCurrentRoute(null); 
    };
  
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
  
    return () => backHandler.remove(); 
  }, [setCurrentRoute,  navigation]); 


return (
  <View style={styles.container}>
    <View style={styles.mapContainer}>
      <View style={styles.zoomUser}>
        <Text title="Zoom In" onPress={handleZoomIn} style={{ fontSize: 16 }}>
          Zoom In</Text>
      </View>
      <MapboxGL.MapView style={{ flex: 1 }} 
      styleURL={MapboxGL.StyleURL.Street} 
      onDidFinishLoadingMap={() => console.log("Map loaded successfully")} 
      logoEnabled={true}
      compassEnabled={true}
      rotateEnabled={true}
      scaleBarEnabled={true}
      zoomEnabled={true}
      pitchEnabled={true}
      >
            { markerCoordinate  &&

        <MapboxGL.Camera zoomLevel={zoomLevel} centerCoordinate={[markerCoordinate.longitude, markerCoordinate.latitude]} animationMode={'flyTo'} animationDuration={3000} />
      
           }

        
        {/* User Marker */}
        <MapboxGL.PointAnnotation id="userMarker" coordinate={[markerCoordinate.longitude, markerCoordinate.latitude]}>
          <View style={{ height: 30, width: 30, backgroundColor: 'red', borderRadius: 50, borderColor: 'white', borderWidth: 3 }} />
        </MapboxGL.PointAnnotation>

        {/* Delivery Marker */}
        <MapboxGL.PointAnnotation id="deliveryMarker" coordinate={[Locate.Longitude, Locate.Latitude]}>
          <View style={{ height: 30, width: 30, backgroundColor: 'blue', borderRadius: 50, borderColor: 'white', borderWidth: 3 }} />
        </MapboxGL.PointAnnotation>

 
        {currentRoute && currentRoute.geometry && currentRoute.geometry.coordinates && currentRoute.geometry.coordinates.length > 0 ? (
  <MapboxGL.ShapeSource
    id="shapeSource"
    shape={{
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: currentRoute.geometry.coordinates,
          },
        },
      ],
    }}
  >
    

<MapboxGL.LineLayer
  id="lineLayer"
  style={{
    lineWidth: 5,
    lineColor: 'rgba(255, 0, 0, 0.4)', 
  }}
/>
  </MapboxGL.ShapeSource>
) : null}
       
      </MapboxGL.MapView>
      <Button title="Get Route" onPress={handleChangeRoute} />
    </View>

    <Modal
      visible={isModalVisible}
      animationType="slide"
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Select a Route</Text>
        {safeAlternateRoutes?.length > 0 ? (
  safeAlternateRoutes.map((altRoute, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => handleSelectRoute(altRoute)}
      style={styles.modalRouteOption}
    >
      {altRoute?.legs?.map((leg, legIndex) => (
        <Text key={legIndex} style={styles.routeOptionText}>
          {leg?.summary || `Leg ${legIndex + 1} summary not available`}
        </Text>
      ))}
<Text style={styles.distanceInterval}>
Distance: {altRoute?.legs?.[0]?.distance 
    ? `${(altRoute.legs[0].distance / 1000).toFixed(2)} km` 
    : "Distance not available"}
</Text>
<Text style={styles.durationInterval}>
Duration: {altRoute?.legs?.[0]?.duration
    ? convertSecondsToTime(altRoute.legs[0].duration)
    : "Duration not available"}
</Text>
    </TouchableOpacity>
  ))
) : (
  <Text>No alternate routes available.</Text>
)}
        <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalCloseButton}>
          <Text style={styles.modalCloseText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>

    <View style={styles.detailsContainer}>
      <View style={styles.driverInfoContainer}>
        <Ionicons name="person-circle-outline" size={40} color="#333" />
        <View style={styles.driverTextContainer}>
          <Text style={styles.driverName}>
            {deliverInfo?.userId?.firstName} {deliverInfo?.userId?.lastName}
          </Text>
          <Text style={styles.driverName}>Total Price: ₱ {deliverInfo?.totalAmount}</Text>
          <Text style={styles.driverPhone}>Order# {deliverInfo?.orderId?._id}</Text>
        </View>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.dropOffButton} onPress={() => failedDelivery( )}>
          <Text style={styles.buttonText}>Failed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dropOffButton} onPress={() => reDeliver()}>
          <Text style={styles.buttonText}>Re-deliver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dropOffButton} onPress={() => navigation.navigate("QrScan", { deliveryId: deliverInfo })}>
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
  alternateRouteContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    zIndex: 1000,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  routeOption: {
    padding: 10,
  },
  routeOptionText: {
    fontSize: 16,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalTitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
  },
  modalRouteOption: {
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 5,
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 5,
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 16,
  },
  zoomUser: {
    position: "absolute",
    bottom: 500,
    left: 10,
    zIndex: 100,
    backgroundColor: "#fff",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  
});

export default LocationDetails;
