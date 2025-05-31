import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createTransaction } from "@redux/Actions/transactionActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { useDispatch } from "react-redux";
import { Alert } from "react-native";
import styles from "@stylesheets/Withdraw/create";
import { sendNotifications } from "@redux/Actions/notificationActions";
import messaging from "@react-native-firebase/messaging";
import { singleCooperative } from "@redux/Actions/coopActions";

const CreateWithdraw = (props) => {
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const userId = context.stateUser?.userProfile?._id;
  const { paymentMethod, paymentData } = props.route.params;
  const [token, setToken] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = await AsyncStorage.getItem("jwt");
        const fcmToken = await messaging().getToken();
        setFcmToken(fcmToken);
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

  const handleConfirm = async () => {
    Alert.alert(
      "Withdrawal Processing",
      "Your withdrawal will be processed within 1 to 5 Business days. Do you want to continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            const transactionData = {
              user: userId,
              type: "WITHDRAW",
              amount: paymentData.amount,
              paymentMethod: paymentMethod,
              accountName: paymentData.name,
              accountNumber: paymentData.phone,
            };

            try {
              const transac = await dispatch(
                createTransaction(transactionData, token)
              );

              console.log("userId: ", userId);

              const cooperative = await dispatch(
                singleCooperative(userId, token)
              );

              const notification = {
                title: "💳 New Transaction",
                content: `A new request transaction has been created by ${cooperative.farmName} for withdrawal of ₱ ${paymentData.amount}.`,
                type: "Withdraw",
                user: "admin",
                url: cooperative.image[0].url,
                fcmToken: fcmToken,
              };

              await dispatch(sendNotifications(notification, token));

              if (transac === true) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "WithdrawList" }],
                });
              } else {
                Alert.alert("Error", "Failed to create transaction.");
              }
            } catch (error) {
              Alert.alert("Error", "Something went wrong. Please try again.");
              console.error("Transaction Error:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.info}>{paymentData.name}</Text>

      <Text style={styles.label}>Payment Method:</Text>
      <Text style={styles.info}>{paymentMethod}</Text>

      <Text style={styles.label}>Phone Number:</Text>
      <Text style={styles.info}>{paymentData.phone}</Text>

      <Text style={styles.label}>Amount:</Text>
      <Text style={styles.info}>₱ {paymentData.amount}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirm Withdraw</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateWithdraw;
