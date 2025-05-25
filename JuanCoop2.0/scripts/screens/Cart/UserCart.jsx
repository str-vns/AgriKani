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
import { memberDetails } from "@redux/Actions/memberActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "@assets/commons/baseurl";
import { Alert } from "react-native";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItems);
  const { loading, members, error } = useSelector((state) => state.memberList);
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const approvedMember = members?.filter(member => member.approvedAt !== null);
  const coopId = approvedMember?.map(member => member.coopId?._id) || [];
  const userId = context?.stateUser?.userProfile?._id;
  const isLogin = context?.stateUser?.isAuthenticated;
  const [token, setToken] = useState(null);
  const [errors, setErrors] = useState("");
  console.log("coopId: ", coopId);
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
  
 useEffect(() => {
  const loadCartItems = async () => {
    try {
      const storedCart = await AsyncStorage.getItem('cartItems');
      if (storedCart) {
        const cartItems = JSON.parse(storedCart);
        dispatch(setCartItems(cartItems));
        dispatch(memberDetails(userId, token));
      }
    } catch (error) {
      console.error("Error loading cart from AsyncStorage:", error);
    }
  };

  loadCartItems();
}, [dispatch]);

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
    const hasNonMemberItem = cartItems.some(item => 
      item?.coop?._id && !coopId.includes(item.coop._id)
  );
    return hasNonMemberItem ? 0.12 : 0;
    
};



  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.pricing * item.quantity, 0);
  };
  const handleTaxInfo = () => {
    Alert.alert(
        "Tax Information",
        "This tax applies to non-members of the cooperative. If you want to save on future purchases, consider registering as a member.",
        [{ text: "OK", style: "cancel" }]
    );
};

const subtax = () => {

  let taxableTotal = 0;

cartItems.forEach((item) => {
    
    const itemTotal = item.pricing * item.quantity;
    if (!coopId.includes(item.coop)) {
      taxableTotal += itemTotal;
    } 
  });

 return taxableTotal;
}

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

  return (
    <View style={styles.container}>
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
          <Text style={styles.ShippingFeeText}>Overall Item: ₱ {calculateTotalPrice() }</Text>
          <Text style={styles.ShippingFeeText}>Shipping Fee: ₱ {calculateShipping() }</Text>
          <View style={styles.rowContainer}>
        <Text style={styles.ShippingFeeText}>Tax: ₱ {(subtax() * calculatedTax()).toFixed(2)}</Text>
        <TouchableOpacity onPress={handleTaxInfo}>
            <Icon name="info" type="material" color="#007BFF" size={15} style={styles.infoIcon} />
        </TouchableOpacity>
    </View>

          <Text style={styles.totalText}>Total: ₱ {calculateFinalTotal() }</Text>
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