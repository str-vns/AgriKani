import React, { useContext, useEffect, useState        } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateCartQuantity, updateCartInv } from "@src/redux/Actions/cartActions";
import { useNavigation } from "@react-navigation/native";
import AuthGlobal from "@redux/Store/AuthGlobal";
import styles from "@screens/stylesheets/Cart/userCart";
import { setCartItems } from '@redux/Actions/cartActions';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "@assets/commons/baseurl";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItems);
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const isLogin = context?.stateUser?.isAuthenticated;
  const [token, setToken] = useState(null);
  const [errors, setErrors] = useState("");

 useEffect(() => {
  const loadCartItems = async () => {
    try {
      const storedCart = await AsyncStorage.getItem('cartItems');
      if (storedCart) {
        const cartItems = JSON.parse(storedCart);
        dispatch(setCartItems(cartItems));
      }
    } catch (error) {
      console.error("Error loading cart from AsyncStorage:", error);
    }
  };

  loadCartItems();
}, [dispatch]);

useEffect(() => {
  const fetchJwt = async () => {
      try {
          const res = await AsyncStorage.getItem("jwt");
          setToken(res);
      } catch (error) {
          console.error("Error retrieving JWT: ", error);
      }
  };

  fetchJwt(); 
}, []);

  const handleRemoveItem = (item) => {
    dispatch(removeFromCart(item.inventoryId));
  };

  const increment = (item) => {
    if(item?.quantity < item?.maxQuantity) {
    dispatch(updateCartQuantity(item.inventoryId, item.quantity + 1));
  };
}

  const decrement = (item) => {
    if (item.quantity > 1) {
      dispatch(updateCartQuantity(item.inventoryId, item.quantity - 1));
    }
  };

  const handleCheckout = async () => {
    if (!isLogin) {
      navigation.navigate("RegisterScreen", { screen: "Login" });
    } else {

      const orderItems = {
        orderItems: cartItems.map((item) => ({
          product: item.productId,
          inventoryId: item.inventoryId,
          quantity: item.quantity,
        })),
      }

      try {
        const { data } = await axios.post(
          `${baseURL}inventory/stock`, 
          orderItems, 
          { 
            headers: { 
              Authorization: `Bearer ${token}` 
            }, 
            timeout: 10000 
          }
        );
       
        console.log("Data: ", data);
      if(data?.details?.success === true) {
        navigation.navigate("CheckOut", { 
          screen: "AddressList", 
          params: { cartItems: cartItems } 
        })
        setErrors("");
      } else {
        data?.details?.lowStockItems?.forEach((item) => {
        console.log("Low stock item: ", item);
        if(item?.reason === "out_of_stock") {
          setErrors(`${item.productName} ${item.unitName} ${item.metricUnit} is out of stock and has been removed from your cart.`);
          dispatch(removeFromCart(item.inventoryId));
        } else if (item?.reason === "low_stock") {
          setErrors( `Quantity for ${item.productName} ${item.unitName} ${item.metricUnit} has been adjusted to ${item.currentStock} due to stock availability.`);
          dispatch(updateCartInv(item.inventoryId, item.currentStock, item.currentStock));
        }
       
        })
      }


      } catch (error) {
        setErrors("Something went wrong while placing the order.");
        console.error("Error creating order:", error);
      }
      // navigation.navigate("CheckOut", { 
      //   screen: "AddressList", 
      //   params: { cartItems: cartItems } 
      // });
    }
  };

  const renderItem = ({ item }) => {
    const totalPrice = item.pricing * item.quantity;
    return (
      <View style={styles.cartItem}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.productName}</Text>
          <Text style={styles.unitName}>{item.unitName} {item.metricUnit}</Text>
          <Text style={styles.itemPrice}>Total: ₱ {totalPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.quantityControl}>
          <TouchableOpacity onPress={() => decrement(item)} style={styles.cartButton}>
            <Text style={styles.cartButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => increment(item)} style={styles.cartButton}>
            <Text style={styles.cartButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => handleRemoveItem(item)}>
          <Icon name="delete" type="material" color="#ff6347" size={30} />
        </TouchableOpacity>
      </View>
    );
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.pricing * item.quantity, 0).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("ProductContainer")}>
          <Icon name="arrow-back" type="material" color="#FFFFFF" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Shopping Cart <Text style={styles.itemCount}>({cartItems.length})</Text>
        </Text>
      </View>
      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.inventoryId.toString()}
        />
      ) : (
        <Text style={styles.emptyCart}>Your cart is empty.</Text>
      )}
      {cartItems.length > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: ₱ {calculateTotalPrice()}</Text>
          {errors ? <Text style={styles.errorText}>{errors}</Text> : null}
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <Text style={styles.buttonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};


export default Cart;