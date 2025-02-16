import React, { useState, useEffect, useContext }from 'react'
import styles from '@screens/stylesheets/Cancelled/Cancelled_Design'
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { updateOrderStatus } from "@src/redux/Actions/orderActions";
import { createCancelled } from "@src/redux/Actions/cancelledActions";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from "../../../SocketIo";
import AuthGlobal from '@redux/Store/AuthGlobal';
import { sendNotifications } from "@redux/Actions/notificationActions";
import messaging from "@react-native-firebase/messaging";
import { getCoop } from "@redux/Actions/productActions";

const Client_Cancelled = (props) => {
     const navigation = useNavigation()
     const context = useContext(AuthGlobal);
     const dispatch = useDispatch()
     const socket = useSocket()
    const { loading, coop, error } = useSelector((state) => state.singleCoop);
     const cancelled = props.route.params;
     const inventoryId = cancelled.inventortId;
     const orderId = cancelled.orderId;
     const orderItemId = cancelled.orderItemId;
     const coops = cancelled.coopUser;
     const userName = context.stateUser.userProfile?.firstName;
     const [selectedReason, setSelectedReason] = useState(null);
     const [otherReason, setOtherReason] = useState("");
     const [token, setToken] = useState(null);
     const [fcmToken, setFcmToken] = useState(null);
     const [refresh, setRefresh] = useState(false);

     const reasons = [
       "Changed my mind",
       "Found a better deal",
       "Order took too long",
       "Ordered by mistake",
       "Product no longer needed",
       "I Just Found Better Alternatives",
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
        dispatch(getCoop(coops, token));
      }, []);

      const handleCancelOrder = () => {
        Alert.alert(
          "Cancel Order",
          "Do you want to cancel this order?",
          [
            {
              text: "No",
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: () => proceedWithCancellation(),
            },
          ],
          { cancelable: false }
        );
      };
      
      const proceedWithCancellation = () => {
        if (selectedReason === "Other") {
          if (otherReason === "") {
            alert("Please specify your reason");
            return;
          }
      
          const cancel = {
            cancelledId: orderItemId,
            cancelledBy: context.stateUser.userProfile._id,
            content: otherReason,
          };
      
          dispatch(createCancelled(cancel, token));
        } else {
          if (selectedReason === null) {
            alert("Please select a reason");
            return;
          }
      
          const cancel = {
            cancelledId: orderItemId,
            cancelledBy: context.stateUser.userProfile._id,
            content: selectedReason,
          };
      
          dispatch(createCancelled(cancel, token));
        }
      
        setRefresh(true);
      
        try {
          const status = {
            orderStatus: "Cancelled",
            inventoryProduct: inventoryId,
          };
      
          dispatch(updateOrderStatus(orderId, status, token));
      
          const notification = {
            title: `Order Cancelled`,
            content: `The order has been cancelled by the client`,
            user: coop?.user?._id,
            fcmToken: fcmToken,
            type: "order",
          };
      
          socket.emit("sendNotification", {
            senderName: userName,
            receiverName: coop?.user?._id,
            type: "order",
          });
      
          dispatch(sendNotifications(notification, token));
      
          alert("Your order has been successfully cancelled.");
        } catch (error) {
          console.error("Error deleting or refreshing orders:", error);
          alert("An error occurred while cancelling your order. Please try again.");
        } finally {
          setRefresh(false);
          navigation.goBack()
        }
      };

     return (
        <ScrollView>
       <View style={styles.container}>
           <Text style={styles.title}>Order Cancelled</Text>
           <Text style={styles.description}>Why did you cancel the order?</Text>
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
             <TouchableOpacity style={styles.button} onPress={() => { handleCancelOrder()}}><Text>Confirm</Text></TouchableOpacity>
             <TouchableOpacity style={styles.button} onPress={() => { navigation.goBack() }}><Text>Back</Text></TouchableOpacity>
           </View>
         </View>
         </ScrollView>
     );
}

export default Client_Cancelled
