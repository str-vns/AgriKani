import React, { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, Button, Dimensions, Alert } from "react-native";
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

const { width, height } = Dimensions.get('window');
const finderWidth = 280;
const finderHeight = 230;
const viewMinX = (width - finderWidth) / 2;
const viewMinY = (height - finderHeight) / 2;

 const QrScan = (props) => {
  const context = useContext(AuthGlobal);
  const navigation = useNavigation()
  const dispatch = useDispatch();
  const socket = useSocket()
  const delivery_ID = props.route.params.deliveryId._id;
  const userName = context.stateUser.userProfile?.firstName;
  const user = context?.stateUser?.userProfile;
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [token, setToken] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);

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
  
        // Prepare notification
        const notification = {
          title: `Order: ${orderId}`,
          content: `Your order has been Delivered, Enjoy your product.`,
          user: userId,
          fcmToken: fcmToken,
          type: "order",
        };
  
        // Send notification via socket
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
            timeInterval: 3000, // 3 seconds
            distanceInterval: 1, // 1 meter
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
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        facing="back"
        style={StyleSheet.absoluteFillObject}
        >
        {/* <View >
            <View style={styles.scanningBox} />
        </View> */}
      </CameraView>
      {scanned && (
         <View style={styles.buttonContainer}>
         <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
       </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningBox: {
    width: width * 0.61,
    height: height * 0.3,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
});

export default QrScan;