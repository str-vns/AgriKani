import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { useDispatch } from "react-redux";
import { Alert } from "react-native";
import { updateOrderStatus } from "@src/redux/Actions/orderActions";
import { createCancelled } from "@src/redux/Actions/cancelledActions";
import { useSocket } from "../../../SocketIo";
import { sendNotifications } from "@redux/Actions/notificationActions";

const Confirm_Cancelled = (props) => {
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const socket = useSocket();
  const userId = context.stateUser?.userProfile?._id;
  const { paymentMethod, paymentData, cancelledData, others } = props.route.params;
  const [token, setToken] = useState(null);
  const [refresh, setRefresh] = useState(false);

  console.log("paymentData", paymentData);
  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = await AsyncStorage.getItem("jwt");
        if (res) {
          setToken(res);
        } else {
          Alert.alert("Error", "Unable to retrieve authentication token.");
        }
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };
    fetchJwt();
  }, []);

  const handlecancelled = async () => {
    const cancel = {
      cancelledId: cancelledData?.cancelledId,
      cancelledBy: cancelledData?.cancelledBy,
      content: cancelledData?.content,
    };
    const cancellation = await dispatch(createCancelled(cancel, token));
    
    setRefresh(true);
    try {
      const status = {
        orderStatus: "Cancelled",
        inventoryProduct: others?.inventoryProduct,
        paymentMethod: paymentMethod,
        accountName: paymentData?.name,
        accountNumber: paymentData?.phone,
        cancelledId: cancellation?._id,

      };
      dispatch(updateOrderStatus(others?.orderId, status, token));

      const notification = {
        title: `Order Cancelled`,
        content: `The order has been cancelled by the User ${others?.userName} ${others?.lastName}.`,
        user: others?.coopUser,
        fcmToken: others?.fcmToken,
        type: "order",
      };

      socket.emit("sendNotification", {
        senderName: others?.userName,
        receiverName: others?.coopUser,
        type: "order",
      });

      dispatch(sendNotifications(notification, token));
      alert("Your order has been successfully cancelled.");
    } catch (error) {
      console.error("Error deleting or refreshing orders:", error);
      alert("An error occurred while cancelling your order. Please try again.");
    } finally {
      setRefresh(false);
      navigation.reset({
        index: 0,
        routes: [{ name: "UserOrderList" }],
      })
    }
  };

  const handleConfirm = async () => {
    Alert.alert(
      "Withdrawal Processing",
      "Your withdrawal will be processed within 1 to 5 Business days. Do you want to continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            handlecancelled()
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.info}>{paymentData?.name}</Text>

      <Text style={styles.label}>Payment Method:</Text>
      <Text style={styles.info}>{paymentMethod}</Text>

      <Text style={styles.label}>Phone Number:</Text>
      <Text style={styles.info}>{paymentData?.phone}</Text>

      <Text style={styles.label}>Cancellation Reason:</Text>
      <Text style={styles.info}>{cancelledData?.content}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#ffffff", // Clean white background for a formal look
  },
  label: {
    fontSize: 16,
    fontWeight: "600", // Slightly lighter than bold for a refined look
    marginTop: 12,
    color: "#2c3e50", // Dark blue-gray for a professional feel
  },
  info: {
    fontSize: 17,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: "#4a4a4a", // Dark gray for readability
    backgroundColor: "#f7f7f7", // Light gray background for contrast
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dcdcdc", // Subtle border for a structured look
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#0056b3", // Deep blue for a formal look
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Slight shadow for a premium touch
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "600",
    textTransform: "uppercase", // Adds a structured and serious tone
    letterSpacing: 1, // Creates a polished appearance
  },
});



export default Confirm_Cancelled;
