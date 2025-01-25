import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
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
import { useSocket } from "../../../SocketIo";
import { getDeliveryTracking } from "@redux/Actions/deliveryActions";
import { useDispatch, useSelector } from "react-redux";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapboxGL from '@rnmapbox/maps'
import Constants from "expo-constants";

const UserTracking = (props) => {
  const socket = useSocket();
  const dispatch = useDispatch()
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const trackInfo = props.route.params.trackId;
  const user = context?.stateUser?.userProfile;
  const { Deliveryloading ,deliveries, Deliveryerror } = useSelector((state) => state.deliveryList);
  const [markerCoordinate, setMarkerCoordinate] = useState({ lat: 37.78825, lng: -122.4324, });
  const [currentDriverRoute, setCurrentDriverRoute] = useState([]);
  const [arrivedData, setArrivedData] = useState({});
  const [zoomLevel, setZoomLevel] = useState(15);
  const [onlineUsers, setOnlineUsers] = useState([]);

  MapboxGL.setAccessToken(Constants.expoConfig?.extra?.MAPBOX_API_KEY);

   useFocusEffect(
    useCallback(() => {
        dispatch(getDeliveryTracking(trackInfo));
        setMarkerCoordinate({ lat: deliveries?.deliveryLocation?.Latitude , lng: deliveries?.deliveryLocation?.Longitude });
    }, [trackInfo])
   )

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

   useEffect(() => {
    socket.on('getDeliveryLocation', (data) => {
      setArrivedData({
        senderId: data.senderId,
        deliveryId: data.deliveryId,
        status: data.status,
      });
  
      setMarkerCoordinate({
        lat: data.latitude,
        lng: data.longitude,
      });

      setCurrentDriverRoute(data.currentRoute);
    });
  
    return () => {
      socket.off('getDeliveryLocation');
    };
  }, [socket]);

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

  const handleZoomIn = () => {
    setZoomLevel(15); 
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
             { markerCoordinate.lat && markerCoordinate.lng && !isNaN(markerCoordinate.lat) && !isNaN(markerCoordinate.lng) &&
                <MapboxGL.Camera 
                  zoomLevel={zoomLevel} 
                  centerCoordinate={[deliveries?.deliveryLocation?.Longitude, deliveries?.deliveryLocation?.Latitude]} 
                  animationMode={'flyTo'} 
                  animationDuration={3000} 
                />
              }

{ deliveries?.deliveryLocation?.Latitude && deliveries?.deliveryLocation?.Longitude  ? (
                <MapboxGL.PointAnnotation
                  id="deliveryMarker"
                  coordinate={[deliveries?.deliveryLocation?.Longitude, deliveries?.deliveryLocation?.Latitude]}
                >
                  <View
                    style={{
                      height: 30,
                      width: 30,
                      backgroundColor: 'blue',
                      borderRadius: 15, 
                      borderColor: 'white',
                      borderWidth: 3,
                    }}
                  />
                </MapboxGL.PointAnnotation>
              ) : null }
              
{ markerCoordinate?.lat && markerCoordinate?.lng && !isNaN(markerCoordinate.lat) && !isNaN(markerCoordinate.lng) ? (
                <MapboxGL.PointAnnotation
                  id="userMarker"
                  coordinate={[markerCoordinate.lng, markerCoordinate.lat]}
                >
                  <View
                    style={{
                      height: 30,
                      width: 30,
                      backgroundColor: 'red',
                      borderRadius: 15, // Correct circle radius
                      borderColor: 'white',
                      borderWidth: 3,
                    }}
                  />
                </MapboxGL.PointAnnotation>
              ) : null }

            

              { currentDriverRoute?.geometry?.coordinates?.length > 0 && arrivedData.status === 'delivering' && arrivedData.deliveryId === deliveries._id ? (
                <MapboxGL.ShapeSource
                  id="shapeSource"
                  shape={{
                    type: 'FeatureCollection',
                    features: [
                      {
                        type: 'Feature',
                        geometry: {
                          type: 'LineString',
                          coordinates: currentDriverRoute?.geometry?.coordinates,
                        },
                      },
                    ],
                  }}
                >
                  <MapboxGL.LineLayer
                    id="lineLayer"
                    style={{ lineWidth: 5, lineColor: '#ff0000' }}
                  />
                </MapboxGL.ShapeSource>
              ) : null }

              </MapboxGL.MapView>
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
  zoomUser: {
    position: "absolute",
    bottom: 400,
    left: 10,
    zIndex: 100,
    backgroundColor: "#fff",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  }
});

export default UserTracking;
