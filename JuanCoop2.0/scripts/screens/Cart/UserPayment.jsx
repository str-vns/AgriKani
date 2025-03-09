import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Payment = ({ route, navigation }) => {
  const { cartItems, addressData } = route.params;
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);

    if(method === "COD") {
    navigation.navigate("Review", { cartItems, addressData, paymentMethod: method });
    } else if (method === "paymaya") {
      navigation.navigate("Paymaya", { cartItems, addressData, paymentMethod: method });
      // alert("This payment method is not yet supported.");
    } else if (method === "gcash") {
      navigation.navigate("Gcash", { cartItems, addressData, paymentMethod: method });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose Payment Method</Text>
      
      {/* Cash on Delivery Button */}
      <TouchableOpacity
        style={[styles.button, styles.codButton]}
        onPress={() => handleSelectPaymentMethod("COD")}
      >
        <Text style={styles.buttonText}>Cash on Delivery</Text>
      </TouchableOpacity>
      
      {/* Credit Card Button */}
      <TouchableOpacity
        style={[styles.button, styles.cardButton]}
        onPress={() => handleSelectPaymentMethod("paymaya")}
      >
        <Text style={styles.buttonText}>Paymaya</Text>
      </TouchableOpacity>
      
      {/* PayPal Button */}
      <TouchableOpacity
        style={[styles.button, styles.paypalButton]}
        onPress={() => handleSelectPaymentMethod("gcash")}
      >
        <Text style={styles.buttonText}>Gcash</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f5f5f5", // Light background color
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 12,
    elevation: 3, // Adds a shadow effect to the button
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  codButton: {
    backgroundColor: "#4CAF50", 
  },
  cardButton: {
    backgroundColor: "#3b5998", 
  },
  paypalButton: {
    backgroundColor: "#0070ba",
  },
});

export default Payment;
