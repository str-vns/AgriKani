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
  ActivityIndicator
} from "react-native";
import { allCoopOrders } from "@redux/Actions/coopActions";
import { fetchCoopOrders } from "@redux/Actions/orderActions";
import { Ionicons } from "@expo/vector-icons";
import styles from "../css/styles";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "@redux/Store/AuthGlobal";
import Icon from "react-native-vector-icons/MaterialIcons";
import { updateCoopOrders } from "@redux/Actions/coopActions";
import { sendNotifications } from "@redux/Actions/notificationActions";
import { singleCooperative } from "@redux/Actions/coopActions";
import { useSocket } from '../../../../SocketIo';

const OrderList = ({ navigation }) => {
  const dispatch = useDispatch()
  const context =  useContext(AuthGlobal);
  const socket = useSocket();
  const userId = context.stateUser.userProfile?._id;
  const userName = context.stateUser.userProfile?.firstName;
  const {orderloading, orders, ordererror } = useSelector((state) => state.coopOrdering);
  const { coops }  = useSelector((state) => state.allofCoops);
  
  const [token, setToken] = useState(null);
  const [refresh, setRefresh] = React.useState(false);
  const filteredOrders = (Array.isArray(orders) ? orders : []).map((order) => ({
    ...order,
    orderItems: Array.isArray(order.orderItems)
      ? order.orderItems.filter((item) => item.coopUser === coops._id)
      : [],
  })).filter((order) => order.orderItems.length > 0);

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
  },[])

  useFocusEffect(
    useCallback(()=>{
      dispatch(singleCooperative(userId, token));
      dispatch(fetchCoopOrders(userId, token))
    },[])
  )

  const onRefresh = useCallback(async () => {
    setRefresh(true);
  
      setTimeout(() => {
        dispatch(fetchCoopOrders(userId, token));
        setRefresh(false);
      }, 500);
  
  }, [userId, token, dispatch]);
 
  const handleProcessOrder = (orderId, InvId, Items ) => {
    setRefresh(true);
    try {
    let productNames = []
   
    Items?.orderItems?.forEach(item => {
      if (item.product && item.inventoryProduct) {
        const productInfo = `${item.product.productName} ${item.inventoryProduct.unitName} ${item.inventoryProduct.metricUnit}`;
        productNames.push(productInfo);
      }
    });

    const productList = productNames.join(', ');

    const notification = {
      title: `Order: ${orderId}`, 
      content: `Your order ${productList} is now being processed.`,
      url: Items?.orderItems[0]?.product?.image[0].url,
      user: Items.user._id,
      senderId: userId
    }

      socket.emit("sendNotification", {
        senderName: userName,
        receiverName:  Items?.user?._id,
        type: "order",
      }

      )
      const orderupdateInfo = {
        InvId,
        orderStatus: "Processing",
      }

      dispatch(sendNotifications(notification , token))
      dispatch(updateCoopOrders(orderId, orderupdateInfo, token))
      setRefresh(false);
      onRefresh()
   } catch (error) {
     console.error("Error deleting or refreshing orders:", error);
   } finally {

     setRefresh(false);
   }
   
  };

  const handleShippingOrder = (orderId, InvId, Items) => {

    setRefresh(true);
    try {
      let productNames = []
      
      Items?.orderItems?.forEach(item => {
        if (item.product && item.inventoryProduct) {
          const productInfo = `${item.product.productName} ${item.inventoryProduct.unitName} ${item.inventoryProduct.metricUnit}`;
          productNames.push(productInfo);
        }
      });

      const productList = productNames.join(', ');
      
      const notification = {
        title: `Order: ${orderId}`,
        content: `Your order ${productList} is now being Shipped.`,
        url: Items?.orderItems[0]?.product?.image[0].url,
        user: Items.user._id,
        senderId: userId
      };

        socket.emit("sendNotification", {
          senderName: userName,
          receiverName:  Items?.user?._id,
          type: "order",
        }
      )
      const orderupdateInfo = {
        InvId,
        orderStatus: "Shipping",
      }

      dispatch(sendNotifications(notification , token))
      dispatch(updateCoopOrders(orderId, orderupdateInfo, token))
      setRefresh(false);
      onRefresh()
   } catch (error) {
     console.error("Error deleting or refreshing orders:", error);
   } finally {

     setRefresh(false);
   }
   
  };

  const handleDeliveryOrder = (orderId, InvId, Items) => {

    setRefresh(true);
    try {
      let productNames = []

      Items?.orderItems?.forEach(item => {
        if (item.product && item.inventoryProduct) {
          const productInfo = `${item.product.productName} ${item.inventoryProduct.unitName} ${item.inventoryProduct.metricUnit}`;
          productNames.push(productInfo);
        }
      });

      const productList = productNames.join(', ');
  
      const notification = {
        title: `Order: ${orderId}`, 
        content: `Your order ${productList} has been Delivered your Product Enjoy!.`,
        url: Items?.orderItems[0]?.product?.image[0].url,
        user: Items.user._id,
        senderId: userId
      }

      socket.emit("sendNotification", {
        senderName: userName,
        receiverName:  Items?.user?._id,
        type: "order",
      }
    )

      const orderupdateInfo = {
        InvId,
        orderStatus: "Delivered",
      }

      dispatch(sendNotifications(notification , token))
      dispatch(updateCoopOrders(orderId, orderupdateInfo, token))
      setRefresh(false);
      onRefresh()
   } catch (error) {
     console.error("Error deleting or refreshing orders:", error);
   } finally {

     setRefresh(false);
   }
   
  }; 

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return { color: '#FFCC00' }; 
      case 'Processing':
        return { color: 'blue' };
      case 'Shipping':
        return { color: 'lightblue' }; 
      case 'Delivered':
        return { color: 'green' };
      case 'Cancelled':
        return { color: 'red' }; 
      default:
        return { color: 'gray' }; 
    }
  }
  
  const renderOrder = ({ item }) => {
    const formattedDate = new Date(item.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderContent}>
          <View style={styles.orderDetails}>
          <Text style={styles.orderId}>Order #{item._id}</Text>
            <Text style={styles.customerName}>
              Customer: {item.user.firstName} {item.user.lastName}
            </Text>
            <Text style={styles.orderDate}>Date: {formattedDate}</Text>
            <Text style={styles.orderInfo}>Total Price: ${item.totalPrice}</Text>
            <Text style={styles.orderInfo}> Delivery Address: {item.shippingAddress.address}, {item.shippingAddress.city}</Text>
            <Text style={[ styles.paymentStatus ? styles.paidStatus : styles.unpaidStatus]}>
              Payment: NOT PAID
            </Text>
  
            <View>

            {item?.orderItems?.length > 0 ? (
  item.orderItems.flat().map((orderItem, index) => { 

 
    return (
      <View key={`${item._id}-${index}`} style={styles.orderItemContainer}>

        <View style={styles.imageAndTextContainer}>
        {orderItem.product?.image && orderItem.product?.image?.length > 0 ? (
    <Image
      source={{ uri: orderItem.product.image[0].url }}
      style={styles.orderImage}
      onError={() => console.error('Error loading image')}
    />
  ) : (
    <Text>No image available</Text>
  )
}

          <View style={styles.textContainer}>
          {orderItem.product?.productName && (
  <Text style={styles.orderItemName}>{orderItem.product.productName}</Text>
)}
            <Text style={styles.orderItemPrice}>Size: {orderItem.inventoryProduct.unitName} {orderItem.inventoryProduct.metricUnit}</Text>
            <Text style={styles.orderItemPrice}>Price: ${orderItem.price}</Text>
            <Text style={styles.orderItemQuantity}>Quantity: {orderItem.quantity}</Text>

            <Text
              style={[
                styles[`status${orderItem.orderStatus}`],
                getStatusColor(orderItem.orderStatus),
              ]}
            >
              <Text style={{ color: 'black' }}>Status: </Text>
              {orderItem.orderStatus}
            </Text>
          </View>
        </View>
      </View>
    );
  })
) : (
  <Text>No items available</Text>
)}


{item?.orderItems?.length > 0 && (
    (item?.orderItems?.flat().every((orderItem) => orderItem.orderStatus === "Pending")) ||
      (item?.orderItems?.flat().some((orderItem) => orderItem.orderStatus === "Pending"))) && (
 <TouchableOpacity
 style={[styles.button, styles.reviewButton]}
 onPress={() =>
   handleProcessOrder(
     item._id,
     item.orderItems
       .flat() 
       .filter((orderItem) => orderItem.orderStatus !== "Cancelled") 
       .map((orderItem) => orderItem.inventoryProduct._id),
    item
   )
 }
>
 <Icon name="rate-review" size={20} color="#fff" />
 <Text style={styles.buttonText}> Processing </Text>
</TouchableOpacity>
)}

{
  item?.orderItems?.length > 0 && (
    (item?.orderItems?.flat().every((orderItem) => orderItem.orderStatus === "Processing")) ||
      (item?.orderItems?.flat().some((orderItem) => orderItem.orderStatus === "Processing"))) && (
 <TouchableOpacity
 style={[styles.button, styles.ShippingButton]}
 onPress={() =>
  handleShippingOrder(
     item._id,
     item.orderItems
       .flat() 
       .filter((orderItem) => orderItem.orderStatus !== "Cancelled") 
       .map((orderItem) => orderItem.inventoryProduct._id),
    item  
      
   )
 }
>
 <Icon name="rate-review" size={20} color="#fff" />
 <Text style={[styles.buttonText, { color: 'white' }]}> Shipping </Text>
</TouchableOpacity>
)}

{
  item?.orderItems?.length > 0 && (
    (item?.orderItems?.flat().every((orderItem) => orderItem.orderStatus === "Shipping")) ||
      (item?.orderItems?.flat().some((orderItem) => orderItem.orderStatus === "Shipping"))) && (
 <TouchableOpacity
 style={[styles.button, styles.DeliveredButton]}
 onPress={() =>
  handleDeliveryOrder(
     item._id,
     item.orderItems
       .flat() 
       .filter((orderItem) => orderItem.orderStatus !== "Cancelled") 
       .map((orderItem) => orderItem.inventoryProduct._id),
    item  
   )
 }
>
 <Icon name="rate-review" size={20} color="#fff" />
 <Text style={[styles.buttonText, { color: 'white' }]}> Delivery </Text>
</TouchableOpacity>
)}

</View>
          </View>
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => navigation.toggleDrawer()}
        >
          <Ionicons name="menu" size={34} color="black" />
        </TouchableOpacity>
  
        <Text style={styles.headerTitle}>Order List</Text>
      </View>
      {orderloading ? (
  <ActivityIndicator size="large" color="black" style={styles.loader} />
) : (
  <>
    {filteredOrders && filteredOrders.length > 0 ? (
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item._id}  
        renderItem={renderOrder}           
        ItemSeparatorComponent={() => <View style={styles.separator} />} 
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

export default OrderList;
