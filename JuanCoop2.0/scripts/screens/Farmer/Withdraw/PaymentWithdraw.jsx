import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "@stylesheets/Withdraw/paymethod";

const PaymentWithdraw = () => {
  const navigation = useNavigation()
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);

    if (method === "paymaya") {
      navigation.navigate("PaymayaWithdraw", {paymentMethod: method });
    } else if (method === "gcash") {
      navigation.navigate("GcashWithdraw", {paymentMethod: method });
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

export default PaymentWithdraw;
