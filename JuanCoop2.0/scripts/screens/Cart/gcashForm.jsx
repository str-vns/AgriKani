import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { memberDetails } from "@redux/Actions/memberActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { onlinePayment, getPayment } from "@src/redux/Actions/orderActions";
import * as Linking from 'expo-linking';

const GcashForm = ({ route, navigation }) => {
  const { cartItems, addressData, paymentMethod } = route.params;
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const { loading, members, error } = useSelector((state) => state.memberList);
  const approvedMember = members?.find((member) => member.approvedAt !== null);
  const { paymentloading, payment, paymenterror } = useSelector((state) => state.onlinePay);
  const { getpaymentloading, getpayment, getpaymenterror } = useSelector((state) => state.getPayment);
  const coopId = approvedMember?.coopId?._id;
  const userId = context?.stateUser?.userProfile?._id;
  const [token, setToken] = useState("");

  useEffect(() => {
    const handleDeepLink = async (event) => {
      const url = event.url;
  
      if (url.startsWith('myjuanapp://')) {
        const urlWithoutScheme = url.replace('myjuanapp://', '');
        const urlObj = new URL('https://' + urlWithoutScheme);  
        const path = urlObj.pathname.replace('/', '/Review');  
        const queryParams = new URLSearchParams(urlObj.search);
  
        if (path === "/Review") {
  
          const paymentIntentId = queryParams.get("payment_intent_id");
          const response = await dispatch(getPayment(paymentIntentId, token));
          console.log("Response: ", response);
          console.log("Payment Intent ID: ", paymentIntentId);
          if (response === "paid"){
       if (paymentIntentId) {
           if(!name || !email || !phone) {
            Alert.alert("Error", "Please fill in your name, email, and phone number.");
          } 
            const paymentData = {
              name,
              email,
              phone,
              amount: calculateFinalTotal(),
              type: paymentMethod,
              payStatus: "Paid",  
              isMobile: true,
              paymentIntentId
            };
  
            navigation.navigate("Review", {
                cartItems: cartItems,
                addressData: addressData,
                paymentData,
                paymentMethod: paymentMethod,
            });
          } else {
            console.log("No payment_intent_id found in the deep link.");
          }
          } else {
            console.log("Payment failed or encountered an issue.");
            Alert.alert("Payment Fail", "Payment was not successful. Please try again or check your payment method.");
          }
          
        }
      }
    };
  
    // Add event listener for deep link
    const subscription = Linking.addEventListener('url', handleDeepLink);
  
    // Cleanup the listener when the component unmounts
    return () => subscription.remove();
  }, [name, email, phone]);
  

  const calculateShipping = () => {
    const uniqueCoops = new Set();

    cartItems.forEach((item) => {
      if (item?.coop?._id) {
        uniqueCoops.add(item.coop._id);
      }
    });

    const shippingCost = uniqueCoops.size * 75;

    return shippingCost;
  };

  const calculatedTax = () => {
    let hasNonMemberItem = false;

    cartItems.forEach((item) => {
      if (item?.coop?._id !== coopId) {
        hasNonMemberItem = true;
      }
    });

    return hasNonMemberItem ? 0.12 : 0;
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.pricing * item.quantity,
      0
    );
  };

  const calculateFinalTotal = () => {
    const shippingCost = calculateShipping();

    let taxableTotal = 0;
    let nonTaxableTotal = 0;

    cartItems.forEach((item) => {
      const itemTotal = item.pricing * item.quantity;
      console.log("Item Total: ", itemTotal);
      if (item?.coop?._id !== coopId) {
        taxableTotal += itemTotal;
      } else {
        nonTaxableTotal += itemTotal;
      }
    });

    const taxAmount = taxableTotal * 0.12;
    const finalTotal =
      taxableTotal + nonTaxableTotal + taxAmount + shippingCost;

    return finalTotal.toFixed(2);
  };

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

  useEffect(() => {
    if (userId) {
      dispatch(memberDetails(userId, token));
    }
  }, [userId]);

  const processPayment = async () => {
    const paymentData = {
      name,
      email,
      phone,
      amount: calculateFinalTotal(),
      type: paymentMethod,
      isMobile: true,
    };
    try {
      const paymentResult = await dispatch(onlinePayment(paymentData, token));
      if (paymentResult?.attributes?.next_action?.redirect?.url) {
        Linking.openURL(paymentResult.attributes.next_action.redirect.url).catch((err) =>
          console.error("Failed to open URL:", err)
        );
      } else {
        throw new Error("Payment processing failed, no redirect URL.");
      }
    } catch (error) {
      console.error("Payment creation error:", error);
      Alert.alert("Error", error.message || "Failed to create payment.");
    }
  }
    
  const handleConfirm = () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter your name.");
      return;
    }
  
    if (!email.includes("@") || !email.includes(".com")) {
      Alert.alert("Validation Error", "Please enter a valid email address with .com.");
      return;
    }
  
    const phoneRegex = /^09\d{9}$/; 
    if (!phoneRegex.test(phone)) {
      Alert.alert(
        "Validation Error",
        "Phone number must start with '09' and be exactly 11 digits long."
      );
      return;
    }
  
    Alert.alert(
      "Confirm Payment",
      `Are you sure you want to proceed with payment of ₱ ${calculateFinalTotal()}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => { 
            processPayment()
          },
        },
      ]
    );
  };

  return (
  <View style={styles.container}>
    <View style={styles.card}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Phone Number:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <Text style={styles.label}>Amount:</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={`₱ ${calculateFinalTotal()}`}
        editable={false}
      />


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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  card: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: "#e9ecef",
    color: "#6c757d",
  },
  confirmButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default GcashForm;
