import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
const OnlinePay_Refund = (props) => {
    console.log(props.route.params.cancelledData);
  const { cancelledData, others } = props.route.params;
  const navigation = useNavigation()
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);

    if (method === "paymaya") {
      navigation.navigate("Paymaya_Cancelled", {paymentMethod: method, cancelledData: cancelledData, others: others });
    } else if (method === "gcash") {
      navigation.navigate("Gcash_Cancelled", {paymentMethod: method, cancelledData: cancelledData, others: others });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose Payment Method </Text>
      
      <TouchableOpacity
        style={[styles.button, styles.cardButton]}
        onPress={() => handleSelectPaymentMethod("paymaya")}
      >
        <Text style={styles.buttonText}>Paymaya</Text>
      </TouchableOpacity>
    
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
    backgroundColor: "#f5f5f5", 
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

export default OnlinePay_Refund;
