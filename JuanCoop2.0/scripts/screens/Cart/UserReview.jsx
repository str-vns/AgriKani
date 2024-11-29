import React, { useContext, useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, FlatList, Image, Alert, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { createOrder } from "@src/redux/Actions/orderActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearCart } from "@src/redux/Actions/cartActions";

const Review = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { cartItems, addressData, paymentMethod } = route.params;
  console.log(cartItems)
  const context = useContext(AuthGlobal);
  const userId = context?.stateUser?.userProfile?._id;
  const [token, setToken] = useState("");

  const totalPrice = cartItems.reduce((acc, item) => acc + item.pricing * item.quantity, 0);
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

  const handleConfirmOrder = async () => {
    if (!userId || !token) {
      Alert.alert("Error", "User not authenticated. Please log in.");
      return;
    }
  
    const outOfStockItems = cartItems.filter(item => item.stock < item.quantity);
    if (outOfStockItems.length > 0) {
      Alert.alert(
        "Error",
        `Some items are out of stock:\n${outOfStockItems
          .map(item => `${item.productName} (Available: ${item.stock})`)
          .join("\n")}`
      );
      return;
    }
  
    const orderData = {
      user: userId,
      orderItems: cartItems.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        price: item.pricing,
        productUser: item.user,
      })),
      shippingAddress: addressData._id,
      paymentMethod,
      totalPrice,
    };
  
    try {
      const orderCreationResult = await dispatch(createOrder(orderData, token));
  
      if (orderCreationResult?.order) {
        Alert.alert("Success", "Your order has been successfully placed!", [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("OrderConfirmation", {
                cartItems,     
                addressData,   
                paymentMethod,   
              }),
          },
        ]);
        dispatch(clearCart());
      } else {
        throw new Error("Order creation response is missing order data.");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      Alert.alert("Error", error.message || "Failed to create order.");
    }
  };
  
  
  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.productName}</Text>
              <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
              <Text style={styles.itemText}>Price: ${item.pricing.toFixed(2)}</Text>
            </View>
          </View>
        )}
      />
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder}>
        <Text style={styles.confirmButtonText}>Confirm Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7", // Light grey background for better contrast
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3, // Adds shadow effect for a card-like appearance
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  itemText: {
    fontSize: 16,
    color: "#777",
  },
  totalContainer: {
    marginVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 15,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "right",
  },
  confirmButton: {
    backgroundColor: "#f7b900", 
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
    elevation: 4,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default Review;