import React, { useCallback, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import styles from "@stylesheets/Rider/AssignList";
import { useDispatch, useSelector } from "react-redux";
import { shippedOrder } from "@redux/Actions/orderActions";
import { deliveryList } from "@redux/Actions/deliveryActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SelectedTab } from "@shared/SelectedTab";
import Loader from "@shared/Loader";
import NoItem from "@shared/NoItem";

const AssignList = () => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userId = context?.stateUser?.userProfile?._id;
  const { shiploading, orders, shiperror } = useSelector(state => state.orderShipped);
  const { deliveries } = useSelector(state => state.deliveryList);
  const [activeTab, setActiveTab] = useState("Assign");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState(null);
  const checkIfDelivered = (orderItems) => {
    if (!Array.isArray(deliveries) || deliveries.length === 0) {
      return false; 
    }
  
    const today = new Date();
    const isSameDay = (date1, date2) =>
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  
    return deliveries.some((delivery) =>
      orderItems.some((orderItem) => {
        const deliveryDate = new Date(delivery.createdAt);
        return (
          delivery._id === orderItem.deliveryId &&
          isSameDay(deliveryDate, today) &&
          ["delivering", "re-delivery", "pending", "delivered"].includes(delivery.status)
        );
      })
    );
  };


  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await AsyncStorage.getItem("jwt");
          if (res) {
            setToken(res);
            if (userId) {
              dispatch(shippedOrder(userId, res));
              dispatch(deliveryList(userId, res));
            } else {
              setErrors('User ID is missing.');
            }
          } else {
            setErrors('No JWT token found.');
          }
        } catch (error) {
          console.error('Error retrieving JWT:', error);
          setErrors('Failed to retrieve JWT token.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [userId, dispatch])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      dispatch(shippedOrder(userId, token));
      dispatch(deliveryList(userId, token));
    } catch (err) {
      console.error("Error refreshing users:", err);
    } finally {
      setRefreshing(false);
    }
  }, [userId, token]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Shipping":
        return "blue";
      default:
        return "black"; 
    }
  };

  const capitalizeFirstLetter = (text) => {
    if (!text) return ""; 
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

   const choicesTab = [
    { label: "Assign", value: "Assign" },
    { label: "Rider", value: "Rider" },
  ]
  const renderOrderItem = ({ item }) => {
    const isDelivered = checkIfDelivered(item?.orderItems);
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderInfo}>
          <Text style={styles.name}>{item.user.firstName} {item.user.lastName}</Text>
          <Text style={styles.orderNumber}>Order # {item._id}</Text>
          <Text>Status:  
            <Text style={[styles.status, { color: getStatusColor(item?.orderItems[0]?.orderStatus) }]}>
              {capitalizeFirstLetter(item?.orderItems[0]?.orderStatus)}
            </Text>
          </Text>
        </View>

          <TouchableOpacity
            style={styles.deliverButton}
            onPress={() => navigation.navigate("AssingDetails", { order: item })}
          >
            <Text style={styles.buttonText}>View</Text>
          </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
 <SelectedTab selectedTab={activeTab} tabs={choicesTab} onTabChange={setActiveTab} />

      {shiploading ? (
        <Loader />
      ) : orders && orders.length === 0 || shiperror ? (
        <NoItem title="No Shipping Assigned" />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          renderItem={renderOrderItem}
        />
      )}
    </View>
  );
};

export default AssignList;
