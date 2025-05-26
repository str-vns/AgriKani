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
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSocket } from "../../../SocketIo";
import { getDeliveryTracking } from "@redux/Actions/deliveryActions";
import { useDispatch, useSelector } from "react-redux";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createConversation } from "@redux/Actions/converstationActions";
import { conversationList } from "@redux/Actions/converstationActions";
import MapboxGL from "@rnmapbox/maps";
import Constants from "expo-constants";

const UserTracking = (props) => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const trackInfo = props.route.params.trackId;
  const user = context?.stateUser?.userProfile;
  const { Deliveryloading, deliveries, Deliveryerror } = useSelector(
    (state) => state.deliveryList
  );
  const { conversations } = useSelector((state) => state.converList);
  const [markerCoordinate, setMarkerCoordinate] = useState({
    lat: 37.78825,
    lng: -122.4324,
  });
  const [currentDriverRoute, setCurrentDriverRoute] = useState([]);
  const [arrivedData, setArrivedData] = useState({});
  const [zoomLevel, setZoomLevel] = useState(15);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [token, setToken] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const existConvo = conversations.find(
    (convo) =>
      convo.members.includes(deliveries?.assignedTo?._id) &&
      convo.members.includes(user?._id)
  );

  const conversationExists = Boolean(existConvo);
  MapboxGL.setAccessToken(Constants.expoConfig?.extra?.MAPBOX_API_KEY);

  useFocusEffect(
    useCallback(() => {
      dispatch(getDeliveryTracking(trackInfo));
      setMarkerCoordinate({
        lat: deliveries?.deliveryLocation?.Latitude,
        lng: deliveries?.deliveryLocation?.Longitude,
      });
    }, [trackInfo])
  );

  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = await AsyncStorage.getItem("jwt");
        setToken(res);
      } catch (error) {
        console.error("Error fetching JWT:", error);
      }
    };

    fetchJwt();
    if (!user?._id) {
      // console.warn("User ID is missing.");
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

    dispatch(conversationList(user?._id, token));

    return () => {
      socket.off("getUsers");
    };
  }, [socket, user?._id]);

  useEffect(() => {
    socket.on("getDeliveryLocation", (data) => {
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
      socket.off("getDeliveryLocation");
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
        return "red";
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
 console.log("deliveries", deliveries.assignedTo?.userId);
  const riderChat = async () => {
    const riderUserId = deliveries?.assignedTo?.userId;
    const currentUserId = user?._id;
    setDisabled(true);
    if (context?.stateUser?.isAuthenticated) {
      try {
        if (conversationExists && existConvo) {
          navigation.navigate("Messages", {
            screen: "ChatMessages",
            params: {
              item: deliveries?.assignedTo,
              conversations: conversations,
              isOnline: onlineUsers,
            },
            
          });
             setDisabled(false);
        } else {
          const newConvo = {
            senderId: currentUserId,
            receiverId: riderUserId,
          };
          const response = await dispatch(createConversation(newConvo, token));
          const response2 = await dispatch(
            conversationList(user?._id, token)
          );
    
          if (response && response2) {
            setTimeout(() => {
              navigation.navigate("Messages", {
                screen: "ChatMessages",
                params: {
                  item: {
                    _id: deliveries?.assignedTo?.userId,
                    firstName: deliveries?.assignedTo?.firstName,
                    lastName: deliveries?.assignedTo?.lastName,
                    image: deliveries?.assignedTo?.image,
                    phoneNum: deliveries?.assignedTo?.phoneNum,
                  },
                  conversations: response2,
                  isOnline: onlineUsers,
                },
              });
              setDisabled(false);
            }, 5000);
          }
        }

      } catch (error) {
        console.error("Error creating conversation:", error);
      }
    }
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
            <View style={styles.backButton}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={20} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.zoomUser}>
              <Text
                title="Zoom In"
                onPress={handleZoomIn}
                style={{ fontSize: 16 }}
              >
                Zoom In
              </Text>
            </View>
            <MapboxGL.MapView
              style={{ flex: 1 }}
              styleURL={MapboxGL.StyleURL.Street}
              onDidFinishLoadingMap={() =>
                console.log("Map loaded successfully")
              }
              logoEnabled={true}
              compassEnabled={true}
              rotateEnabled={true}
              scaleBarEnabled={true}
              zoomEnabled={true}
              pitchEnabled={true}
            >
              {deliveries?.deliveryLocation?.Longitude &&
                deliveries?.deliveryLocation?.Latitude && (
                  <MapboxGL.Camera
                    zoomLevel={zoomLevel}
                    centerCoordinate={[
                      deliveries?.deliveryLocation?.Longitude,
                      deliveries?.deliveryLocation?.Latitude,
                    ]}
                    animationMode={"flyTo"}
                    animationDuration={3000}
                  />
                )}

              {deliveries?.deliveryLocation?.Latitude &&
              deliveries?.deliveryLocation?.Longitude ? (
                <MapboxGL.PointAnnotation
                  id="deliveryMarker"
                  coordinate={[
                    deliveries?.deliveryLocation?.Longitude,
                    deliveries?.deliveryLocation?.Latitude,
                  ]}
                >
                  <View
                    style={{
                      height: 30,
                      width: 30,
                      backgroundColor: "blue",
                      borderRadius: 15,
                      borderColor: "white",
                      borderWidth: 3,
                    }}
                  />
                </MapboxGL.PointAnnotation>
              ) : null}

              {markerCoordinate?.lat &&
              markerCoordinate?.lng &&
              !isNaN(markerCoordinate.lat) &&
              !isNaN(markerCoordinate.lng) ? (
                <MapboxGL.PointAnnotation
                  id="userMarker"
                  coordinate={[markerCoordinate.lng, markerCoordinate.lat]}
                >
                  <View
                    style={{
                      height: 30,
                      width: 30,
                      backgroundColor: "red",
                      borderRadius: 15, // Correct circle radius
                      borderColor: "white",
                      borderWidth: 3,
                    }}
                  />
                </MapboxGL.PointAnnotation>
              ) : null}

              {/* { currentDriverRoute?.geometry?.coordinates?.length > 0 && arrivedData.status === 'delivering' && arrivedData.deliveryId === deliveries._id ? (
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
              ) : null } */}
            </MapboxGL.MapView>
          </View>
          <View style={styles.detailsContainer}>
            <View
              style={[
                styles.separateContainer,
                { flexDirection: "row", alignItems: "flex-start" },
              ]}
            >
              <View style={[styles.driverInfoContainer, { flex: 2 }]}>
                {deliveries?.assignedTo?.image?.url ? (
                  <Image
                    source={{ uri: deliveries?.assignedTo?.image?.url }}
                    style={styles.driverImage}
                  />
                ) : (
                  <Ionicons
                    name="person-circle-outline"
                    size={65}
                    color="#333"
                  />
                )}
                <View style={styles.driverTextContainer}>
                  <Text style={styles.driverName}>
                    {deliveries?.assignedTo?.firstName}{" "}
                    {deliveries?.assignedTo?.lastName}
                  </Text>
                  <Text style={styles.driverPhone}>
                    PhoneNum: {deliveries?.assignedTo?.phoneNum}
                  </Text>
                  <Text style={styles.driverDetails}>
                    Status:{" "}
                    <Text
                      style={[
                        styles.status,
                        {
                          color: getStatusColor(
                            arrivedData.status || deliveries?.status
                          ),
                        },
                      ]}
                    >
                      {capitalizeFirstLetter(
                        arrivedData.status || deliveries?.status
                      )}
                    </Text>
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.messageButton,
                  { flex: 1, marginLeft: 77, marginTop: 20 },
                ]}
              >
                <TouchableOpacity
                  disabled={disabled}
                  activeOpacity={0.7}
                  style={styles.messageButtonText}
                  onPress={() => riderChat()}
                >
                  { disabled ? (
                    <ActivityIndicator size="small" color="#333" />) : (
                  <Text style={styles.buttonText}>
                    {" "}
                    <Ionicons
                      name="chatbubble-outline"
                      size={13}
                      color="#333"
                    />{" "}
                    Chat
                  </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.dropOffButton}
                onPress={() =>
                  navigation.navigate("QrGenerate", { deliveryId: deliveries })
                }
              >
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
  },
  driverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  messageButton: {
    backgroundColor: "#98FF98",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginLeft: 15,
  },
  messageButtonText: {
    color: "#333",
    fontSize: 10,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 10,
    zIndex: 1000,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
  },
});

export default UserTracking;
