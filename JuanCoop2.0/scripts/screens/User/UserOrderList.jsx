import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useSelector, useDispatch } from "react-redux";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SelectedTab } from "@shared/SelectedTab";

import {
  fetchUserOrders,
  updateOrderStatus,
} from "@src/redux/Actions/orderActions";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const UserOrderList = () => {
  const dispatch = useDispatch();
  const { stateUser } = useContext(AuthGlobal);
  const navigation = useNavigation();
  const userId = stateUser?.userProfile?._id;
  const { loading, orders, error } = useSelector((state) => state.orders);
  const [token, setToken] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refresh, setRefresh] = React.useState(false);
  const [refreshing, setRefreshing] = useState(false);
const [selectedTab, setSelectedTab] = useState("Pending");

 const filterTab = orders
  ?.map((order) => ({
    ...order,
    orderItems: order.orderItems.filter((item) => item.orderStatus === selectedTab),
  }))
  .filter((order) => order.orderItems.length > 0);

  const choicesTab = [
    { label: "Pending", value: "Pending" },
    { label: "Processing", value: "Processing" },
    { label: "Shipping", value: "Shipping" },
    { label: "Delivered", value: "Delivered" },
    { label: "Cancelled", value: "Cancelled" },
  ]

  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("jwt");
        if (storedToken) setToken(storedToken);
      } catch (err) {
        console.error("Error retrieving JWT: ", err);
      }
    };
    fetchJwt();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (userId && token) {
        dispatch(fetchUserOrders(userId, token));
      }
    }, [userId, token, dispatch])
  );

  const onRefresh = useCallback(async () => {
    setRefresh(true);

    setTimeout(() => {
      dispatch(fetchUserOrders(userId, token));
      setRefresh(false);
    }, 500);
  }, [userId, token, dispatch]);

  const handleCancelOrder = (
    orderId,
    inventortId,
    orderItemId,
    coopUser,
    paymentMethod
  ) => {
    navigation.navigate("Client_Cancelled", {
      orderId,
      inventortId,
      orderItemId,
      coopUser,
      paymentMethod,
    });
  };

  const handleOpenReviewModal = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleReviewSubmit = (orderId, productId) => {
    navigation.navigate("Reviews", {
      screen: "AddReviews",
      params: { orderId, productId },
    });
  };

  const toggleExpandedOrder = (orderId) => {
    setExpandedOrders((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedOrders[item._id];
    return (            
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Order ID: {item._id}</Text>
          <Text style={styles.orderTotal}>
            Total: ₱{item.totalPrice.toFixed(2)}
          </Text>
        </View>

        {/* Show the first item in the order */}
        {item.orderItems.slice(0, 1).map((orderItem) => (
          <View key={orderItem._id} style={styles.productCard}>
            <Image
              source={
                orderItem.product.image[0]?.url
                  ? { uri: orderItem.product.image[0]?.url }
                  : require("@assets/img/eggplant.png")
              }
              style={styles.productImage}
            />

            <View style={styles.productDetails}>
              <Text style={styles.productName}>
                {orderItem.product.productName}
              </Text>
              <Text style={styles.sizeQuantity}>
                Size: {orderItem?.inventoryProduct?.unitName}{" "}
                {orderItem?.inventoryProduct?.metricUnit}
              </Text>
              <Text style={styles.productQuantity}>
                Qty: {orderItem.quantity}
              </Text>
              <Text style={styles.productPrice}>
                ₱{orderItem?.inventoryProduct?.price}
              </Text>
            </View>

            <View style={styles.actionButtons}>
              <Text style={styles.orderStatus(orderItem.orderStatus)}>
                {orderItem.orderStatus}
              </Text>
              {orderItem.orderStatus === "Delivered" && (
                <TouchableOpacity
                  style={[styles.button, styles.reviewButton]}
                  onPress={() => handleReviewSubmit(item._id, orderItem)}
                >
                  <Icon name="rate-review" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Review</Text>
                </TouchableOpacity>
              )}

              {orderItem.orderStatus === "Shipping" && (
                <TouchableOpacity
                  style={[styles.button, styles.reviewButton]}
                  onPress={() =>
                    navigation.navigate("UserTracking", {
                      trackId: orderItem.deliveryId,
                    })
                  }
                >
                  <Icon name="rate-review" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Track</Text>
                </TouchableOpacity>
              )}

              {orderItem.orderStatus === "Pending" && (
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() =>
                    handleCancelOrder(
                      item?._id,
                      orderItem.inventoryProduct?._id,
                      orderItem?._id,
                      orderItem?.coopUser,
                      item?.paymentMethod

                    )
                  }
                >
                  <Icon name="cancel" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {/* Show additional items when expanded */}
        {isExpanded &&
          item.orderItems.slice(1).map((orderItem) => (
            <View key={orderItem._id} style={styles.productCard}>
              <Image
                source={
                  orderItem.product.image[0]?.url
                    ? { uri: orderItem.product.image[0]?.url }
                    : require("@assets/img/eggplant.png")
                }
                style={styles.productImage}
              />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>
                  {orderItem.product.productName}
                </Text>
                <Text style={styles.sizeQuantity}>
                  Size: {orderItem.inventoryProduct.unitName}{" "}
                  {orderItem.inventoryProduct.metricUnit}
                </Text>
                <Text style={styles.productQuantity}>
                  Qty: {orderItem.quantity}
                </Text>
                <Text style={styles.productPrice}>
                  ₱{orderItem.inventoryProduct.price}
                </Text>
              </View>

              <View style={styles.actionButtons}>
                <Text style={styles.orderStatus(orderItem.orderStatus)}>
                  {orderItem.orderStatus}
                </Text>
                {orderItem.orderStatus === "Delivered" && (
                  <TouchableOpacity
                    style={[styles.button, styles.reviewButton]}
                    onPress={() => handleReviewSubmit(item._id, orderItem)}
                  >
                    <Icon name="rate-review" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Review</Text>
                  </TouchableOpacity>
                )}

                {orderItem.orderStatus === "Shipping" && (
                  <TouchableOpacity
                    style={[styles.button, styles.reviewButton]}
                    onPress={() =>
                      navigation.navigate("UserTracking", {
                        trackId: orderItem.deliveryId,
                      })
                    }
                  >
                    <Icon name="rate-review" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Track</Text>
                  </TouchableOpacity>
                )}

                {orderItem.orderStatus === "Pending" && (
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() =>
                      handleCancelOrder(
                        item?._id,
                        orderItem.inventoryProduct?._id,
                        orderItem?._id,
                        orderItem?.coopUser,
                        item?.paymentMethod
                      )
                    }
                  >
                    <Icon name="cancel" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

        {/* Toggle button to show/hide additional products */}
        {item.orderItems.length > 1 && (
          <TouchableOpacity
            style={[styles.showAllButton, { backgroundColor: "transparent" }]}
            onPress={() => toggleExpandedOrder(item._id)}
          >
            <Text style={[styles.showAllButtonText, { color: "#808080" }]}>
              {isExpanded ? "Show Less" : "Show All"}
            </Text>
            <Icon
              name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={20}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
       <SelectedTab selectedTab={selectedTab} tabs = {choicesTab} onTabChange={setSelectedTab} isOrder={true} />
      {loading ? (
        <ActivityIndicator />
      ) : filterTab && filterTab.length > 0 ? (
        <FlatList
          data={filterTab}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.noOrdersText}>No orders found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  orderCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 15,  
    borderWidth: 1,
    borderColor: "#e1e1e1",
  },
  orderHeader: {
    flexDirection: "column", // Stack children vertically
    alignItems: "flex-start", // Align to the left
    marginBottom: 10, // Add spacing below the header if needed
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4, // Add spacing between Order ID and Total
  },
  orderTotal: {
    fontSize: 14,
    color: "#555",
  },
  orderStatus: (status) => ({
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color:
      status === "Delivered"
        ? "#28a745"
        : status === "Processing"
        ? "#0000FF"
        : status === "Shipping"
        ? "#FFA500"
        : status === "Cancelled"
        ? "red"
        : "#ffc107",
  }),
  orderTotal: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  productQuantity: {
    fontSize: 12,
    color: "#666",
  },
  productPrice: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  showAllButton: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "transparent",
  },
  showAllButtonText: {
    color: "#007bff",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 8,
    marginLeft: 120,
    //textAlign: "center",
  },
  arrowIcon: {
    color: "#b6b5b4",
    //marginLeft: 2,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    //width: "45%",
  },
  reviewButton: {
    backgroundColor: "#4caf50",
    marginLeft: 250,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    marginLeft: 250,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#f44336",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  noOrdersText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  showAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 10,
  },
  showAllButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 8,
  },
  actionButtons: {
    flexDirection: "column",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  reviewButton: {
    backgroundColor: "#4caf50",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    marginHorizontal: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalProduct: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  modalProductImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 10,
  },
  modalProductName: {
    fontSize: 16,
    flex: 1,
  },
  modalCloseButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  sizeQuantity: {
    fontSize: 12,
    color: "#666",
  },
});

export default UserOrderList;
