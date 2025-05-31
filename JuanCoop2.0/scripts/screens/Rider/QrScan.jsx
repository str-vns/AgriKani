import React, { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, Button, Alert, TouchableOpacity } from "react-native";
import { CameraView, Camera } from "expo-camera";
import {updateDeliveryStatus } from "@redux/Actions/deliveryActions";   
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from '@react-native-firebase/messaging';
import { sendNotifications } from "@redux/Actions/notificationActions";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { useSocket } from "../../../SocketIo";
import * as Location from 'expo-location'
import styles from "@stylesheets/Delivery/qrScan";
import Ionicons from "react-native-vector-icons/Ionicons";

 const QrScan = (props) => {
  const context = useContext(AuthGlobal);
  const navigation = useNavigation()
  const dispatch = useDispatch();
  const socket = useSocket()
  const deliverInfo = props.route.params.deliveryId;
  const delivery_ID = props.route.params.deliveryId._id;
  const userName = context.stateUser.userProfile?.firstName;
  const user = context?.stateUser?.userProfile;
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [token, setToken] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);
  const [ markerCoordinate, setMarkerCoordinate ] = useState({ latitude: 0, longitude: 0 });
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
  },[])

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

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = async ({ data }) => {
    try {
      const { deliveryId, status, orderId, userId } = JSON.parse(data);
      console.log("QR Code scanned: ", data);
  
      if (deliveryId === delivery_ID) {
        setScanned(true);
  
        const notification = {
          title: `Order: ${orderId}`,
          content: `Your order has been Delivered, Enjoy your product.`,
          url: "https://res.cloudinary.com/diljhwf3a/image/upload/v1746856018/files/mkenwabkxpdtpa6vmwul.png",
          user: userId,
          fcmToken: fcmToken,
          type: "order",
        };
  
        socket.emit("sendNotification", {
          senderName: userName,
          receiverName: userId,
          type: "order",
        });
  
        dispatch(sendNotifications(notification, token));
        dispatch(updateDeliveryStatus(deliveryId, status, token));
  
        // Navigate to Deliveries screen
        navigation.navigate("Deliveries");

        // Start location tracking
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
              deliveryId: null,
              currentRoute: [0,0],
            });
          }
        );
  
        // Cleanup subscription when done
        return () => {
          locationSubscription?.remove();
        };
  
     
       
      } else {
        setScanned(true);
        Alert.alert("Invalid QR Code", "Please scan the correct QR Code");
      }
    } catch (error) {
      console.error("Error in handleBarcodeScanned: ", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };




  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  return (
    <View style={styles.container}>
     <View style={styles.backButton}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={20} color="#333" />
          </TouchableOpacity>
        </View>
    <View style={styles.cameraContainer}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr", "pdf417"] }}
        facing="back"
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <View style={styles.scanButtonContainer}>
          <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
    
    {/* Delivery Info at the Bottom */}
    <View style={styles.detailsContainer}>
      <Text style={styles.driverName}>{deliverInfo?.userId?.firstName} {deliverInfo?.userId?.lastName}</Text>
      <Text style={styles.infoText}>Total Price: ₱ {deliverInfo?.totalAmount}</Text>
      <Text style={styles.infoText}>Order# {deliverInfo?.orderId?._id}</Text>
    </View>
  </View>
  );
}

export default QrScan;