import React, { useContext } from "react";
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
import { removeFromCart, updateCartQuantity } from "@src/redux/Actions/cartActions";
import { useNavigation } from "@react-navigation/native";
import AuthGlobal from "@redux/Store/AuthGlobal";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItems);
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const isLogin = context?.stateUser?.isAuthenticated;
  const handleRemoveItem = (item) => {
    dispatch(removeFromCart(item.id));
  };

  const increment = (item) => {
    dispatch(updateCartQuantity(item.id, item.quantity + 1));
  };

  const decrement = (item) => {
    if (item.quantity > 1) {
      dispatch(updateCartQuantity(item.id, item.quantity - 1));
    }
  };

  const handleCheckout = () => {
    if (!isLogin) {
      navigation.navigate("Login");
    } else {
      navigation.navigate("AddressList", {cartItems});
    }
  };

  const renderItem = ({ item }) => {
    const totalPrice = item.pricing * item.quantity;
    return (
      <View style={styles.cartItem}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.productName}</Text>
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
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text style={styles.emptyCart}>Your cart is empty.</Text>
      )}
      {cartItems.length > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: ₱ {calculateTotalPrice()}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#f7b900",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  itemCount: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  itemPrice: {
    fontSize: 14,
    color: "#ff6347",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cartButton: {
    paddingHorizontal: 10,
  },
  cartButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 10,
  },
  emptyCart: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  totalContainer: {
    padding: 40,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    alignItems: "center",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  checkoutButton: {
    backgroundColor: "#f7b900",
    borderRadius: 10,
    bottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 100,
    marginTop: 15,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Cart;