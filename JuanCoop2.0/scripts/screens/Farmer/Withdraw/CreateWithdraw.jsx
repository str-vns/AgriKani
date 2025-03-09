import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createTransaction } from "@redux/Actions/transactionActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { useDispatch } from "react-redux";
import { Alert } from "react-native";
const CreateWithdraw = (props) => {
  const navigation = useNavigation()
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const userId = context.stateUser?.userProfile?._id;
  const { paymentMethod, paymentData } = props.route.params;
  const [token, setToken] = useState(null);

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
              amount: paymentData.amount,
              paymentMethod: paymentMethod,
              accountName: paymentData.name,
              accountNumber: paymentData.phone,
            };
  
            try {
              const transac = await dispatch(createTransaction(transactionData, token));
  
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

export default CreateWithdraw;
