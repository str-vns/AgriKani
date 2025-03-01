import React, { useState, useEffect, useContext }from 'react'
import styles from '@screens/stylesheets/Cancelled/Cancelled_Design'
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { createCancelled } from "@src/redux/Actions/cancelledActions";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthGlobal from '@redux/Store/AuthGlobal';
import { useDispatch } from 'react-redux';
import { useSocket } from "../../../SocketIo";
import messaging from "@react-native-firebase/messaging";
import { sendNotifications } from "@redux/Actions/notificationActions";
import { updateDeliveryStatus } from "@redux/Actions/deliveryActions";

const Rider_Cancelled = (props) => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const socket = useSocket()
    const cancelled = props.route.params.deliveryId;
    const userId =  props.route.params.userId
    const context = useContext(AuthGlobal);
    const userName = context.stateUser.userProfile?.firstName;
    const [selectedReason, setSelectedReason] = useState(null);
    const [otherReason, setOtherReason] = useState("");
    const [token, setToken] = useState(null);
    const [fcmToken, setFcmToken] = useState(null);
    console.log("test",cancelled)
 
    const reasons = [
      "Customer Unreachable",
      "No One Available at Delivery Address",
      "Customer Refused Delivery",
      "Customer Requested Reschedule",
      "No Safe Place to Leave the Package",
      "Customer Did Not Answer the Door",
      "Office or Business Closed",
      "Delivery Attempt Failed",
      "Other"
    ];

    useEffect(() => {
        const fetchJwt = async () => {
          try {
            const storedToken = await AsyncStorage.getItem("jwt");
            if (storedToken) setToken(storedToken);
            const fcmToken = await messaging().getToken();
            setFcmToken(fcmToken);
          } catch (err) {
            console.error("Error retrieving JWT: ", err);
          }
        };
        fetchJwt();
      }, []);


    const handleDeliveryFailed = () => {
 
       if(selectedReason === "Other" ) {
        if( otherReason === "") {
          alert("Please specify your reason")
          return;
        }

         const cancel = {
            cancelledId: cancelled,
            cancelledBy: context.stateUser.userProfile._id,
            content: otherReason,
         }

         dispatch(createCancelled(cancel, token));

         
       } else {
        if( selectedReason === null) {
          alert("Please select a reason")
          return;
        }

        const cancel = {
          cancelledId: cancelled,
          cancelledBy: context.stateUser.userProfile._id,
          content: selectedReason,
       }
          dispatch(createCancelled(cancel, token));
       }

       // ------- notif------- //
       const notification = {
        title: `Delivery Failed`,
        content: `Your Product has been failed to deliver because ${selectedReason === "Other" ? otherReason : selectedReason}, ${userName}`,
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
      dispatch(updateDeliveryStatus(cancelled, "failed" , token))
      
      navigation.navigate("Deliveries")
        };

    return (
    <ScrollView>
      <View style={styles.container}>
          <Text style={styles.title}>Delivery Failed</Text>
          <Text style={styles.description}>Why did you failed the order?</Text>
          {reasons.map((reason, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.reasonButton,
                selectedReason === reason && styles.selectedReason
              ]}
              onPress={() => setSelectedReason(reason)}
            >
              <Text style={styles.reasonText}>{reason}</Text>
            </TouchableOpacity>
          ))}
         {selectedReason === "Other" && (
          <TextInput
            style={styles.bigInput}
            placeholder="Please specify your reason"
            value={otherReason}
            onChangeText={setOtherReason}
            multiline
            numberOfLines={4}
          />
        )}
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.button} onPress={() => handleDeliveryFailed()}><Text>Confirm</Text></TouchableOpacity>
            <TouchableOpacity style={styles.button}
            onPress={() => navigation.goBack()}
            
            ><Text>Back</Text></TouchableOpacity>
          </View>
        </View>
    </ScrollView>
    );
}

export default Rider_Cancelled
