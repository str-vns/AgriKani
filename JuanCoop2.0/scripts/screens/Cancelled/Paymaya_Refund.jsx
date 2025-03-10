import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { memberDetails } from "@redux/Actions/memberActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import * as Linking from 'expo-linking';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getWallet } from "@redux/Actions/walletActions";

const Paymaya_Refund = (props) => {
  const { paymentMethod, cancelledData, others } = props.route.params;
  const navigation = useNavigation()
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
   const { loading, wallet, error } = useSelector((state) => state.getWallet);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const userId = context?.stateUser?.userProfile?._id;
  const [token, setToken] = useState("");

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

  useFocusEffect(
    useCallback(() => {
     dispatch(getWallet(userId, token))
    },[])
  )
  
  const handleConfirm = () => {

    if (!name || !phone ) {
        Alert.alert("Validation Error", "Please fill in all fields.");
        return;
    }

    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter your name.");
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
      `Are you sure you want to proceed with payment?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => { 
            const paymentData = {
                name,
                phone,
            }
            navigation.navigate("Confirm_Cancelled", { paymentMethod: paymentMethod, cancelledData: cancelledData,  paymentData: paymentData, others: others });
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

      <Text style={styles.label}>Phone Number:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
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

export default Paymaya_Refund;
