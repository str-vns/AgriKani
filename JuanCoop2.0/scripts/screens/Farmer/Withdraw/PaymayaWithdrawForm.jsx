import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { memberDetails } from "@redux/Actions/memberActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import * as Linking from "expo-linking";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getWallet } from "@redux/Actions/walletActions";
import styles from "@stylesheets/Withdraw/form";
const PaymayaForm = (props) => {
  const { paymentMethod } = props.route.params;
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const { loading, wallet, error } = useSelector((state) => state.getWallet);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
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
      dispatch(getWallet(userId, token));
    }, [])
  );

  const handleConfirm = () => {
    if (!name || !phone || !amount) {
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

    if (wallet?.balance === 0) {
      Alert.alert(
        "Insufficient Balance",
        "You have insufficient balance to proceed with payment."
      );
      return;
    }

    if (amount > wallet?.balance) {
      Alert.alert(
        "Insufficient Balance",
        "Your Amount exceeds your current balance."
      );
      setAmount(wallet?.balance.toString());
      return;
    }

    Alert.alert(
      "Confirm Payment",
      `Are you sure you want to proceed with payment of ₱ ${amount}?`,
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
              amount,
            };
            navigation.navigate("CreateWithdraw", {
              paymentMethod: paymentMethod,
              paymentData: paymentData,
            });
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

        <Text style={styles.label}>Amount:</Text>
        <TextInput
          style={[styles.input]}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymayaForm;
