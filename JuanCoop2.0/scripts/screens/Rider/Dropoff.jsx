import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Modal,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { useSocket } from "@SocketIo";
import { fetchRoute } from "@redux/Actions/locationActions";
import { updateDeliveryStatus } from "@redux/Actions/deliveryActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import AuthGlobal from "@redux/Store/AuthGlobal";
import MapboxGL from "@rnmapbox/maps";
import Constants from "expo-constants";
import styles from "@stylesheets/Delivery/dropoff";
import Loader from "@shared/Loader";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import messaging from "@react-native-firebase/messaging";
import { createConversation } from "@redux/Actions/converstationActions";
import { conversationList } from "@redux/Actions/converstationActions";
import { getUsers } from "@redux/Actions/userActions";

const LocationDetails = (props) => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const { RouteLoading, routes, RouteError } = useSelector((state) => state.MapBoxRoute);
  const { conversations } = useSelector((state) => state.converList);
  const { users } = useSelector((state) => state.getThemUser);
  const deliverInfo = props.route.params.deliveryItem;
  const Locate = deliverInfo?.deliveryLocation;
  const user = context?.stateUser?.userProfile;
  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: 14.5995,
    longitude: 120.9842,
  });
  const [token, setToken] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);
  const [routeFetched, setRouteFetched] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(14);
  const [mapLoading, setMapLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const userId = context?.stateUser?.userProfile?._id;

 const existConvo = conversations.find(
    (convo) =>
      convo.members.includes(deliverInfo?.userId?._id) &&
      convo.members.includes(user?._id)
  );

  const conversationExists = Boolean(existConvo);
  
  MapboxGL.setAccessToken(Constants.expoConfig?.extra?.MAPBOX_API_KEY);

  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = await AsyncStorage.getItem("jwt");
        const fcmToken = await messaging().getToken();
        setFcmToken(fcmToken);
        setToken(res);
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };
    fetchJwt();
  }, []);

  useEffect(() => {
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

    return () => {
      socket.off("getUsers");
    };
  }, [socket, user?._id]);

  const failedDelivery = () => {
    navigation.navigate("Rider_Cancelled", {
      deliveryId: deliverInfo._id,
      userId: deliverInfo?.userId?._id,
    });
  };

  const reDeliver = () => {
    dispatch(updateDeliveryStatus(deliverInfo._id, "pending", token));
    setCurrentRoute(null);
    navigation.navigate("Deliveries");
  };

  useEffect(() => {
    const getCurrentLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Permission to access location was denied"
        );
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

          socket.emit("deliveryLocationUpdate", {
            lat: latitude,
            lng: longitude,
            status: deliverInfo.status,
            receiverId: deliverInfo.userId._id,
            senderId: deliverInfo.assignedTo.userId,
            deliveryId: deliverInfo._id,
            currentRoute: currentRoute,
          });
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
        dispatch(fetchRoute(destination, markerCoordinate));
        setIsModalVisible(true);
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    }
  };

  const handleSelectRoute = (selectedRoute) => {
    setCurrentRoute(selectedRoute);
    setIsModalVisible(false);
  };

  const safeAlternateRoutes =
    Array.isArray(routes) && routes?.length > 0 ? routes : [];

  const convertSecondsToTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hrs > 0 ? `${hrs}h ` : ""}${mins > 0 ? `${mins}m ` : ""}${
      secs > 0 ? `${secs}s` : ""
    }`.trim();
  };

  const handleZoomIn = () => {
    setZoomLevel(15);
  };

  useEffect(() => {
    if (userId && token) {
      dispatch(conversationList(userId, token));
    }
  }, [userId, token, dispatch]);

  useEffect(() => {
    if (conversations && Array.isArray(conversations) && userId && token) {
      const friends = conversations.flatMap((conversation) =>
        conversation.members.filter((member) => member !== userId)
      );

      if (friends.length > 0) {
        dispatch(getUsers(friends, token));
      }
    }
  }, [conversations, userId, token]);

  const phone = () => {
    const phoneNumber = deliverInfo?.userId?.phoneNum;
    if (phoneNumber) {
      const url = `tel:${phoneNumber}`;
      Linking.openURL(url).catch((err) =>
        console.error("Failed to open dialer:", err)
      );
    } else {
      console.warn("Phone number is not available.");
    }
  }
  const chatNow = async () => {
    const userId = deliverInfo?.userId?._id;
    const currentUserId = user?._id
    setDisabled(true)

    if(context?.stateUser?.isAuthenticated) {
      try {
              if (conversationExists && existConvo) {
                 navigation.navigate("ChatMessaging", {
                      item: {
                        _id: deliverInfo?.userId?._id,
                        firstName: deliverInfo?.userId?.firstName,
                        lastName: deliverInfo?.userId?.lastName,
                        image: deliverInfo?.userId?.image,
                      },
                      conversations: conversations,
                      isOnline: onlineUsers,
                    });
                setDisabled(false);
              } else {
                const newConvo = {
                  senderId: currentUserId,
                  receiverId: userId,
                };
                const response = await dispatch(createConversation(newConvo, token));
                const response2 = await dispatch(conversationList(user?._id, token));
      
                if (response && response2) {
                  setTimeout(() => {
                    navigation.navigate("ChatMessaging", {
                      item: {
                        _id: deliverInfo?.userId?._id,
                        firstName: deliverInfo?.userId?.firstName,
                        lastName: deliverInfo?.userId?.lastName,
                        image: deliverInfo?.userId?.image,
                      },
                      conversations: response2,
                      isOnline: onlineUsers,
                    });
                    setDisabled(false);
                  }, 5000);
                }
              }
            } catch (error) {
              console.error("Error creating conversation:", error);
            }
          }
    }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <View style={styles.backButton}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={20} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.zoomUser}>
          <Text title="Zoom In" onPress={handleZoomIn} style={{ fontSize: 16 }}>
            Zoom In
          </Text>
        </View>
        <MapboxGL.MapView
          style={{ flex: 1 }}
          styleURL={MapboxGL.StyleURL.Street}
          onDidFinishLoadingMap={() => setMapLoading(false)}
          logoEnabled={true}
          compassEnabled={true}
          rotateEnabled={true}
          scaleBarEnabled={true}
          zoomEnabled={true}
          pitchEnabled={true}
        >
          {markerCoordinate && (
            <MapboxGL.Camera
              zoomLevel={zoomLevel}
              centerCoordinate={[
                markerCoordinate.longitude,
                markerCoordinate.latitude,
              ]}
              animationMode={"flyTo"}
              animationDuration={3000}
            />
          )}

          <MapboxGL.PointAnnotation
            id="userMarker"
            coordinate={[markerCoordinate.longitude, markerCoordinate.latitude]}
          >
            <View
              style={{
                height: 30,
                width: 30,
                backgroundColor: "red",
                borderRadius: 50,
                borderColor: "white",
                borderWidth: 3,
              }}
            />
          </MapboxGL.PointAnnotation>

          <MapboxGL.PointAnnotation
            id="deliveryMarker"
            coordinate={[Locate.Longitude, Locate.Latitude]}
          >
            <View
              style={{
                height: 30,
                width: 30,
                backgroundColor: "blue",
                borderRadius: 50,
                borderColor: "white",
                borderWidth: 3,
              }}
            />
          </MapboxGL.PointAnnotation>

          {currentRoute &&
          currentRoute.geometry &&
          currentRoute.geometry.coordinates &&
          currentRoute.geometry.coordinates.length > 0 ? (
            <MapboxGL.ShapeSource
              id="shapeSource"
              shape={{
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    geometry: {
                      type: "LineString",
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
                  lineColor: "rgba(255, 0, 0, 0.4)",
                }}
              />
            </MapboxGL.ShapeSource>
          ) : null}
        </MapboxGL.MapView>

        {mapLoading && (
          <View style={styles.mapLoading}>
            <Loader />
          </View>
        )}

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
                    {leg?.summary ||
                      `Leg ${legIndex + 1} summary not available`}
                  </Text>
                ))}
                <Text style={styles.distanceInterval}>
                  Distance:{" "}
                  {altRoute?.legs?.[0]?.distance
                    ? `${(altRoute.legs[0].distance / 1000).toFixed(2)} km`
                    : "Distance not available"}
                </Text>
                <Text style={styles.durationInterval}>
                  Duration:{" "}
                  {altRoute?.legs?.[0]?.duration
                    ? convertSecondsToTime(altRoute.legs[0].duration)
                    : "Duration not available"}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No alternate routes available.</Text>
          )}
          <TouchableOpacity
            onPress={() => setIsModalVisible(false)}
            style={styles.modalCloseButton}
          >
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.detailsContainer}>
        <View style={styles.driverInfoContainer}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <Text style={styles.driverName}>
              {deliverInfo?.userId?.firstName} {deliverInfo?.userId?.lastName}
            </Text>
            <Text style={styles.totalAmountContainer}>
              Total Price:{" "}
              <Text style={styles.totalAmountText}>
                ₱ {deliverInfo?.totalAmount}
              </Text>
            </Text>
            <Text style={styles.totalAmountContainer}>
              Mode of Payment:{" "}
              <Text style={styles.totalAmountText}>
                {deliverInfo?.paymentMethod === "paymaya"
                  ? "Paymaya"
                  : deliverInfo?.paymentMethod === "gcash"
                  ? "Gcash"
                  : "COD"}
              </Text>
            </Text>
            <Text style={styles.totalAmountContainer}>
              Payment Status:{" "}
              <Text style={styles.totalAmountText}>
                {deliverInfo?.payStatus === "Paid" ? "Paid" : "Unpaid"}
              </Text>
            </Text>
          </View>
          <TouchableOpacity
            disabled={disabled}
            style={styles.chatButton}
            onPress={() => chatNow(deliverInfo)}
          >
            <Ionicons name="chatbubble-ellipses" size={30} color="#FFD300" />
          </TouchableOpacity>
           <TouchableOpacity
            disabled={disabled}
            style={styles.chatButton}
            onPress={() => phone()}
          >
            <Icons name="phone" size={30} color="#FFD300" />
          </TouchableOpacity>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.dropOffButton}
            onPress={() => failedDelivery()}
          >
            <Text style={styles.buttonText}>Failed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropOffButton}
            onPress={() => reDeliver()}
          >
            <Text style={styles.buttonText}>Re-deliver</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropOffButton}
            onPress={() =>
              navigation.navigate("QrScan", { deliveryId: deliverInfo })
            }
          >
            <Text style={styles.buttonText}>Delivered</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LocationDetails;
