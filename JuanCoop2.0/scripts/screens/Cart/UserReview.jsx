import React, { useContext, useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, FlatList, Image, Alert, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "@src/redux/Actions/orderActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearCart } from "@src/redux/Actions/cartActions";
import { memberDetails } from "@redux/Actions/memberActions";

const Review = ({ route, navigation }) => {
  console.log(route.params,"route.params");
  const dispatch = useDispatch();
  const { cartItems, addressData, paymentMethod, paymentData } = route.params;
  const { loading, members, error } = useSelector((state) => state.memberList);
  const context = useContext(AuthGlobal);
  const approvedMember = members?.filter(member => member.approvedAt !== null);
  const coopId = approvedMember?.map(member => member.coopId?._id) || [];
  const userId = context?.stateUser?.userProfile?._id;
  const [token, setToken] = useState("");

  console.log("paymentData: ", paymentData);
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
    return cartItems.reduce((total, item) => total + item.pricing * item.quantity, 0);
  };

const calculateFinalTotal = () => {
    const shippingCost = calculateShipping();

    let taxableTotal = 0;
    let nonTaxableTotal = 0;
    
    cartItems.forEach((item) => {
      const itemTotal = item.pricing * item.quantity;
      console.log("Item Total: ", itemTotal);
  
      if (!coopId.includes(item?.coop?._id)) {
          taxableTotal += itemTotal;  
      } else {
          nonTaxableTotal += itemTotal;  
      }
  });

    const taxAmount = taxableTotal * 0.12; 
    const finalTotal = taxableTotal + nonTaxableTotal + taxAmount + shippingCost;

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
    if(userId) {
      dispatch(memberDetails(userId, token));
    }
  }, [userId]);

  const handleConfirmOrder = async () => {
    if (!userId || !token) {
      Alert.alert("Error", "User not authenticated. Please log in.");
      return;
    }
  
  let payStatus;

  if (paymentData?.payStatus === "Paid") {
    payStatus = "Paid";
  } else {
    payStatus = "Unpaid";
  }

  console.log("Payment Status: ", payStatus);
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
        coopUser: item.coop,
        user: item.user,
        inventoryProduct: item.inventoryId,   
      })),
      
      shippingAddress: addressData._id,
      paymentMethod,
      payStatus: payStatus,
      shippingPrice: calculateShipping(),
      totalPrice: calculateFinalTotal(),
    };
  
    try {
      const orderCreationResult = await dispatch(createOrder(orderData, token));
    
      if (orderCreationResult === true) {
        Alert.alert("Success", "Your order has been successfully placed!", [
          {
            text: "OK",
            onPress: () => {
              // Reset the navigation stack and navigate to OrderConfirmation
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "OrderConfirmation",
                    params: {
                      cartItems,
                      addressData,
                      paymentMethod,
                    },
                  },
                ],
              });
            },
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
        keyExtractor={(item) => item.inventoryId}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.productName}</Text>
              <Text style={styles.itemUnit}>{item.unitName} {item.metricUnit}</Text>
              <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
              <Text style={styles.itemText}>Price: ₱{item.pricing.toFixed(2)}</Text>
            </View>
          </View>
        )}
      />
      
      <View style={styles.totalContainer}>
      <Text style={styles.totalShippingText}>Shipping Fee: ₱ {calculateShipping()}</Text>
      <Text style={styles.totalShippingText}>Overall Item: ₱ {calculateTotalPrice()}</Text>
        <Text style={styles.totalText}>Total: ₱ {calculateFinalTotal()}</Text>
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
  itemUnit: {
    fontSize: 12,
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
    elevation: 4,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  totalShippingText: {
    fontSize: 13,
    color: "#333",
    textAlign: "right",
  },
});

export default Review;