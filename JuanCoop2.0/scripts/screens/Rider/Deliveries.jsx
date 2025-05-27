import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Profileuser } from "@redux/Actions/userActions";
import {
  getDeliveryDriver,
  updateDeliveryStatus,
} from "@redux/Actions/deliveryActions";
import { driverProfile } from "@redux/Actions/driverActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { Alert } from "react-native";
import { SelectedTab } from "@shared/SelectedTab";
import { isOnline } from "@utils/usage";
import Loader from "@shared/Loader";
import NoItem from "@shared/NoItem";
import styles from "@stylesheets/Delivery/deliver";

const Deliveries = () => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userId = context?.stateUser?.userProfile?._id;
  const { Deliveryloading, deliveries, Deliveryerror } = useSelector((state) => state.deliveryList);
  const [activeTab, setActiveTab] = useState("Pending");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState(null);
  const [markerCoordinate, setMarkerCoordinate] = useState(null);
  const onlineUsers = isOnline({ userId });

  useEffect(() => {
    const getCurrentLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 3,
        });

        const { latitude, longitude } = location.coords;
        setMarkerCoordinate({ lat: latitude, lng: longitude });
      } catch (error) {
        console.error("Error getting Location:", error);
      }
    };
    getCurrentLocation();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (!markerCoordinate) {
          console.warn("Marker coordinate is not set yet.");
          return;
        }

        setLoading(true);
        try {
          const res = await AsyncStorage.getItem("jwt");
          if (res) {
            setToken(res);
            if (userId) {
              dispatch(Profileuser(userId, res));
              dispatch(driverProfile(userId, res));

              const mark = {
                latitude: markerCoordinate?.lat,
                longitude: markerCoordinate?.lng,
              };
              dispatch(getDeliveryDriver(userId, mark, res));
            } else {
              setErrors("User ID is missing.");
            }
          } else {
            setErrors("No JWT token found.");
          }
        } catch (error) {
          console.error("Error retrieving JWT:", error);
          setErrors("Failed to retrieve JWT token.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [userId, dispatch, markerCoordinate])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const mark = {
        latitude: markerCoordinate?.lat,
        longitude: markerCoordinate?.lng,
      };

      dispatch(getDeliveryDriver(userId, mark, token));
      dispatch(driverProfile(userId, token));
    } catch (err) {
      console.error("Error refreshing users:", err);
    } finally {
      setRefreshing(false);
    }
  }, [userId, token]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "orange";
      case "delivering":
        return "blue";
      case "cancelled":
        return "red";
      case "re-deliver":
        return "purple";
      case "failed":
        return "gray";
      case "delivered":
        return "green";
      default:
        return "black";
    }
  };

  const capitalizeFirstLetter = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const deliveryNow = (item) => {
    Alert.alert("📦 Delivery", "Are you sure you want to deliver this item?", [
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          console.log("Deliver Pressed");
          if (item.status === "pending") {
            dispatch(updateDeliveryStatus(item?._id, "delivering", token));
            navigation.navigate("Dropoff", { deliveryItem: item });
          } else {
            navigation.navigate("Dropoff", { deliveryItem: item });
          }
        },
      },
    ]);
  };

  const choicesTab = [
    { label: "Pending", value: "Pending" },
    { label: "On Delivery", value: "Delivering" },
    { label: "Delivered", value: "Delivered" },
    { label: "Failed", value: "Failed" },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onRefresh(); 
  };
  
  const activeTabLabel = choicesTab.find(tab => tab.value.toLowerCase() === activeTab.toLowerCase())?.label || activeTab;
   
  const filterTab = deliveries
    ? deliveries.filter((delivery) =>
        Array.isArray(delivery?.status)
          ? delivery.status.some(
              (item) => item?.status === activeTabLabel.toLowerCase()
            )
          : delivery.status === activeTab.toLowerCase()
      )
    : [];

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderInfo}>
        <Text style={styles.name}>
          {item.userId.firstName} {item?.userId?.lastName}
        </Text>
        <Text style={styles.orderNumber}>Order # {item?.orderId?._id}</Text>
        <Text>
          Status:{" "}
          <Text
            style={[styles.status, { color: getStatusColor(item?.status) }]}
          >
            {capitalizeFirstLetter(item?.status)}
          </Text>
        </Text>
      </View>
        <View style={styles.actions}>
          {item.status === "pending" || item.status === "delivering" || item.status === "re-deliver" ? (
            <TouchableOpacity
              style={styles.deliverButton}
              onPress={() => deliveryNow(item)}
            >
              <Text style={styles.buttonText}>Deliver now</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
          
            style={styles.detailsButton}
            onPress={() => navigation.navigate("Details", { deliveryId: item })}
          >
            <Text style={styles.detailsText}>View Details</Text>
          </TouchableOpacity>
        </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SelectedTab
        selectedTab={activeTab}
        tabs={choicesTab}
        onTabChange={handleTabChange}
        isOrder={true}
      />

      {Deliveryloading ? (
        <Loader />
      ) : (filterTab && filterTab?.length === 0) || Deliveryerror ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {activeTab === "Pending"
              ?    <NoItem title={`${activeTabLabel}`} />
              :    <NoItem title={`${activeTabLabel}`} />}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filterTab}
          keyExtractor={(item) => item?._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <NoItem title={`${activeTabLabel}`} />
          }
          contentContainerStyle={styles.listContainer}
          renderItem={renderOrderItem}
        />
      )}
    </View>
  );
};

export default Deliveries;
