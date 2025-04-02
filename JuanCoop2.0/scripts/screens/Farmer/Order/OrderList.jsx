import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { allCoopOrders } from "@redux/Actions/coopActions";
import { fetchCoopOrders } from "@redux/Actions/orderActions";
import { Ionicons } from "@expo/vector-icons";
// import styles from "../css/styles";

import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "@redux/Store/AuthGlobal";
import Icon from "react-native-vector-icons/MaterialIcons";
import { updateCoopOrders } from "@redux/Actions/coopActions";
import { sendNotifications } from "@redux/Actions/notificationActions";
import { singleCooperative } from "@redux/Actions/coopActions";
import { useSocket } from "../../../../SocketIo";
import messaging from "@react-native-firebase/messaging";
import { createConversation } from "@redux/Actions/converstationActions";
import { conversationList } from "@redux/Actions/converstationActions";
import { getUsers } from "@redux/Actions/userActions";

const OrderList = ({ navigation }) => {
  const dispatch = useDispatch();
  const context = useContext(AuthGlobal);
  const socket = useSocket();
  const userId = context.stateUser.userProfile?._id;
  const userName = context.stateUser.userProfile?.firstName;
  const { orderloading, orders, ordererror } = useSelector(
    (state) => state.coopOrdering
  );
  const { users } = useSelector((state) => state.getThemUser);
  const { conversations } = useSelector((state) => state.converList);
  const { coops } = useSelector((state) => state.allofCoops);
  const [token, setToken] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);
  const [refresh, setRefresh] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const filteredOrders = (Array.isArray(orders) ? orders : [])
    .map((order) => ({
      ...order,
      orderItems: Array.isArray(order.orderItems)
        ? order.orderItems.filter((item) => item.coopUser === coops._id)
        : [],
    }))
    .filter((order) => order.orderItems?.length > 0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (userId && token) {
      dispatch(conversationList(userId, token));
    }
  }, [userId, token, dispatch]);

  useEffect(() => {
    if (conversations && Array.isArray(conversations) && userId && token) {
      const friends = conversations.flatMap((conversation) =>
        conversation.members.filter((member) => member !== userId)
      );

      if (friends.length > 0) {
        dispatch(getUsers(friends, token));
      }
    }
  }, [conversations, userId, token]);

  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = await AsyncStorage.getItem("jwt");
        const fcmToken = await messaging().getToken();
        setFcmToken(fcmToken);
        setToken(res);
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };
    fetchJwt();
  }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(singleCooperative(userId, token));
      dispatch(fetchCoopOrders(userId, token));
    }, [])
  );

  useEffect(() => {
    socket.emit("addUser", userId);

    socket.on("getUsers", (users) => {
      const onlineUsers = users.filter(
        (user) => user.online && user.userId !== null
      );
      setOnlineUsers(onlineUsers);
    });

    return () => {
      socket.off("getUsers");
    };
  }, [socket, userId]);

  useEffect(() => {

    if (users && onlineUsers.length > 0) {
      const userIsOnline = users.some((user) =>
        onlineUsers.some(
          (onlineUser) =>
            onlineUser.userId === user.details._id &&
            onlineUser.online &&
            onlineUser.userId !== null
        )
      );

      setIsOnline(userIsOnline);
    } else {
      setIsOnline(false);
    }
  }, [users, onlineUsers]);

  const onRefresh = useCallback(async () => {
    setRefresh(true);

    setTimeout(() => {
      dispatch(fetchCoopOrders(userId, token));
      setRefresh(false);
    }, 500);
  }, [userId, token, dispatch]);

  const handleProcessOrder = (orderId, InvId, Items) => {
    setLoading(true);
    setRefresh(true);
    try {
      let productNames = [];

      Items?.orderItems?.forEach((item) => {
        if (item.product && item.inventoryProduct) {
          const productInfo = `${item.product.productName} ${item.inventoryProduct.unitName} ${item.inventoryProduct.metricUnit}`;
          productNames.push(productInfo);
        }
      });

      const productList = productNames.join(", ");

      const notification = {
        title: `Order: ${orderId}`,
        content: `Your order ${productList} is now being processed.`,
        url: Items?.orderItems[0]?.product?.image[0].url,
        user: Items.user._id,
        fcmToken: fcmToken,
        type: "order",
      };

      socket.emit("sendNotification", {
        senderName: userName,
        receiverName: Items?.user?._id,
        type: "order",
      });
      const orderupdateInfo = {
        InvId,
        orderStatus: "Processing",
      };

      dispatch(sendNotifications(notification, token));
      dispatch(updateCoopOrders(orderId, orderupdateInfo, token));
      setRefresh(false);

      setTimeout(() => {
        onRefresh();
      }, 1000);
    } catch (error) {
      console.error("Error deleting or refreshing orders:", error);
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  };

  const handleShippingOrder = (orderId, InvId, Items) => {
    setLoading(true);
    setRefresh(true);
    try {
      let productNames = [];

      Items?.orderItems?.forEach((item) => {
        if (item.product && item.inventoryProduct) {
          const productInfo = `${item.product.productName} ${item.inventoryProduct.unitName} ${item.inventoryProduct.metricUnit}`;
          productNames.push(productInfo);
        }
      });

      const productList = productNames.join(", ");

      const notification = {
        title: `Order: ${orderId}`,
        content: `Your order ${productList} is now being Shipped.`,
        url: Items?.orderItems[0]?.product?.image[0].url,
        user: Items.user._id,
        fcmToken: fcmToken,
        type: "order",
      };
      console.log(fcmToken);
      socket.emit("sendNotification", {
        senderName: userName,
        receiverName: Items?.user?._id,
        type: "order",
      });
      const orderupdateInfo = {
        InvId,
        orderStatus: "Shipping",
      };

      dispatch(sendNotifications(notification, token));
      dispatch(updateCoopOrders(orderId, orderupdateInfo, token));
      setRefresh(false);

      setTimeout(() => {
        onRefresh();
      }, 1000);
    } catch (error) {
      console.error("Error deleting or refreshing orders:", error);
    } finally {
      setRefresh(false);
      setLoading(false);
    }
  };

  const chatNow = async (item) => {
    setLoading(true);
    const UserIdThe = item?.user?._id;
    const currentUserId = userId;

    const existConvo = conversations.find(
      (convo) =>
        convo.members.includes(userId) && convo.members.includes(UserIdThe)
    );
    const conversationExists = Boolean(existConvo);

    // console.log("existConvo", conversationExists)
    // console.log("conversation", conversations)

    if (context?.stateUser?.isAuthenticated) {
      try {
        if (conversationExists && existConvo) {
          navigation.navigate("Messaging", {
            screen: "ChatMessaging", // Correct screen name based on your Stack.Navigator
            params: {
              item: item?.user,
              conversations: conversations,
              isOnline: onlineUsers,
            },
          });
        } else {
          const newConvo = {
            senderId: currentUserId,
            receiverId: UserIdThe,
          };

          const response = await dispatch(createConversation(newConvo, token));
          if (response) {
            setTimeout(() => {
              navigation.navigate("Messaging", {
                screen: "ChatMessaging",
                params: {
                  item: item.user,
                  conversations: conversations,
                  isOnline: onlineUsers,
                },
              });
            }, 5000)
            setRefresh(false);
          } else {
            console.error("Error creating conversation");
            setRefresh(false);
          }
        }
      } catch (error) {
        console.error(
          "Error while creating or navigating to conversation:",
          error
        );
      }
    } else {
      navigation.navigate("RegisterScreen", { screen: "Login" });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return { color: "#E6A500" }; // Yellow
      case "Processing":
        return { color: "#0057D9" }; // Darker Blue
      case "Shipping":
        return { color: "#007AFF" }; // Darker Light Blue
      case "Delivered":
        return { color: "#2E8B57" }; // Dark Green
      case "Cancelled":
        return { color: "#D32F2F" }; // Dark Red
      default:
        return { color: "#555555" }; // Darker Gray
    }
  };
  

  const renderOrder = ({ item }) => {
    const formattedDate = new Date(item?.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderContent}>
          <View style={styles.orderDetails}>
            <Text style={styles.orderId}>Order #{item?._id}</Text>
            <Text style={styles.customerName}>
            <Text style={styles.label}>Customer:</Text>  {item?.user?.firstName} {item?.user?.lastName}
            </Text>
            <Text style={styles.orderDate}><Text style={styles.label}>Date</Text>  {formattedDate}</Text>
            { item?.totalAmount !== 0 && 
            (
            <Text style={styles.orderInfo}>
              <Text style={styles.label}>Total Price:</Text>  ₱ {item?.totalAmount}
            </Text>
            )
            }
            <Text style={styles.orderInfo}>
            <Text style={styles.label}>Address:</Text> {item?.shippingAddress?.address},{" "}
              {item?.shippingAddress?.city}
            </Text>
            <Text
              style={[
                item?.payStatus === "Paid" ? styles?.paidStatus : styles?.unpaidStatus,
              ]}
            >
              Payment: {item?.payStatus === "Paid" ? "Paid" : "Unpaid"}
            </Text>

            <View>
              {item?.orderItems?.length > 0 ? (
                item.orderItems.flat().map((orderItem, index) => {
                  return (
                    <View
                      key={`${item._id}-${index}`}
                      style={styles.orderItemContainer}
                    >
                      <View style={styles.imageAndTextContainer}>
                        {orderItem?.product?.image &&
                        orderItem?.product?.image?.length > 0 ? (
                          <Image
                            source={{ uri: orderItem?.product?.image[0]?.url }}
                            style={styles.orderImage}
                            onError={() => console.error("Error loading image")}
                          />
                        ) : (
                          <Text>No image available</Text>
                        )}

                        <View style={styles.textContainer}>
                 
    {orderItem.product?.productName && (
      <Text style={styles.orderItemName}>{orderItem.product.productName}</Text>
    )}
   
 
                          <Text style={styles.orderItemPrice}>
                            Size: {orderItem.inventoryProduct?.unitName}{" "}
                            {orderItem.inventoryProduct?.metricUnit}
                          </Text>
                          <Text style={styles.orderItemPrice}>
                            Price: ₱ {orderItem?.price}
                          </Text>
                          <Text style={styles.orderItemQuantity}>
                            Quantity: {orderItem?.quantity}
                          </Text>
                          <View style={{  flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 5  }}>
                          <Text
                            style={[
                              styles[`status${orderItem?.orderStatus}`],
                              getStatusColor(orderItem?.orderStatus),
                            ]}
                          >
                            <Text style={{ color: "black" }}>Status: </Text>
                            {orderItem?.orderStatus}
                          </Text>
                          { orderItem?.orderStatus === "Cancelled" && (
                          <TouchableOpacity style={styles.buttonCancelled} onPress={() => navigation.navigate("Reason", { order: orderItem })}>
                          <Text style={styles.buttonTextCancelled}>View</Text>
                          </TouchableOpacity>
                          )}
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })
              ) : (
                <Text>No items available</Text>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.chatButton]}
                  disabled={loading}
                  onPress={() => chatNow(item)}
                >
                  <Icon name="rate-review" size={20} color="#fff" />
                  <Text style={styles.chatButtonText}>Chat</Text>
                </TouchableOpacity>

                {item?.orderItems?.length > 0 &&
                  (item?.orderItems
                    ?.flat()
                    .every(
                      (orderItem) => orderItem.orderStatus === "Pending"
                    ) ||
                    item?.orderItems
                      ?.flat()
                      .some(
                        (orderItem) => orderItem.orderStatus === "Pending"
                      )) && (
                    <TouchableOpacity
                      style={[styles.button, styles.reviewButton]}
                      disabled={loading}
                      onPress={() =>
                        handleProcessOrder(
                          item?._id,
                          item?.orderItems
                            .flat()
                            .filter(
                              (orderItem) =>
                                orderItem?.orderStatus !== "Cancelled"
                            )
                            .map((orderItem) => orderItem?.inventoryProduct?._id),
                          item
                        )
                      }
                    >
                      <Icon name="rate-review" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Processing</Text>
                    </TouchableOpacity>
                  )}

                {item?.orderItems?.length > 0 &&
                  (item?.orderItems
                    ?.flat()
                    .every(
                      (orderItem) => orderItem.orderStatus === "Processing"
                    ) ||
                    item?.orderItems
                      ?.flat()
                      .some(
                        (orderItem) => orderItem.orderStatus === "Processing"
                      )) && (
                    <TouchableOpacity
                      style={[styles.button, styles.ShippingButton]}
                      disabled={loading}
                      onPress={() =>
                        handleShippingOrder(
                          item?._id,
                          item?.orderItems
                            .flat()
                            .filter(
                              (orderItem) =>
                                orderItem?.orderStatus !== "Cancelled"
                            )
                            .map((orderItem) => orderItem?.inventoryProduct?._id),
                          item
                        )
                      }
                    >
                      <Icon name="rate-review" size={20} color="#fff" />
                      <Text style={[styles.buttonText, { color: "white" }]}>
                        Shipping
                      </Text>
                    </TouchableOpacity>
                  )}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => navigation.toggleDrawer()}
        >
          <Ionicons name="menu" size={34} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Order List</Text>
      </View> */}
      {orderloading ? (
        <ActivityIndicator size="large" color="black" style={styles.loader} />
      ) : (
        <>
          {filteredOrders && filteredOrders?.length > 0 ? (
            <FlatList
              data={filteredOrders}
              keyExtractor={(item) => item?._id}
              renderItem={renderOrder}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
              }
              ListEmptyComponent={
                <Text style={styles.noOrdersText}>No orders found.</Text>
              }
            />
          ) : (
            <Text style={styles.noOrdersText}>No orders found.</Text>
          )}
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  chatButton: {
    backgroundColor: "#008CBA", // A professional blueish color
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chatButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  orderContent: {
    flex: 1,
  },
  orderDetails: {
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  customerName: {
    fontSize: 14,
    color: "#444",
    marginVertical: 3,
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  orderInfo: {
    fontSize: 14,
    color: "#333",
    marginVertical: 3,
  },
  label: {
    fontWeight: "bold",
    color: "#111",
  },
  paymentStatus: {
    fontSize: 14,
    fontWeight: "bold",
  },
  paidStatus: {
    color: "#228B22", // Darker green for a classier look
  },
  unpaidStatus: {
    color: "#D32F2F",
  },
  orderItemContainer: {
    flexDirection: "row",
    backgroundColor: "#F4F4F4",
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  imageAndTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  orderImage: {
    width: 55,
    height: 55,
    borderRadius: 10,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
  },
  orderItemPrice: {
    fontSize: 14,
    color: "#555",
  },
  orderItemQuantity: {
    fontSize: 14,
    color: "#777",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF9800", // More professional orange
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewButton: {
    backgroundColor: "#2E7D32", // A deeper, premium green
  },
  ShippingButton: {
    backgroundColor: "#1565C0", // Professional navy blue
  },
  buttonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
  buttonCancelled: {
    backgroundColor: "#B71C1C", // Darker red for a refined cancellation button
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonTextCancelled: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
});





export default OrderList;
