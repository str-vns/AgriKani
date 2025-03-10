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
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  info: {
    fontSize: 18,
    paddingVertical: 5,
    color: "#555",
  },
  buttonContainer: {
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Confirm_Cancelled;
