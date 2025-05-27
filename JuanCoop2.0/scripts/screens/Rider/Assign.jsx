import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { thisMonthDelivery } from "@redux/Actions/deliveryActions";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { removeDelivery } from "@redux/Actions/deliveryActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "@stylesheets/Rider/Assigned";
import Loader from "@shared/Loader";

const Assign = (props) => {
  const driverId = props?.route?.params?.driver;
  const userId = driverId?._id;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { Deliveryloading, deliveries, Deliveryerror } = useSelector(
    (state) => state.deliveryList
  );
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await AsyncStorage.getItem("jwt");
          if (res) {
            setToken(res);
            if (userId) {
              dispatch(thisMonthDelivery(userId, res));
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
    }, [userId, dispatch])
  );

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
        return "#FF6961";
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      dispatch(thisMonthDelivery(userId, token));
    } catch (err) {
      console.error("Error refreshing users:", err);
    } finally {
      setRefreshing(false);
    }
  }, [userId, token]);

  const removeDeliverys = (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this delivery?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            dispatch(removeDelivery(id, token));
            onRefresh();
          },
          style: "destructive",
        },
      ]
    );
  };

  const renderOrder = ({ item }) => {
    return (
      <View style={styles.orderRow}>
        <Text style={styles.deliveryText}>
          Delivery Id: <Text style={styles.orderText}>{item._id}</Text>
        </Text>

        <Text style={styles.deliveryText}>Order Id:</Text>
        <Text style={styles.orderText}>{item.orderId}</Text>

        <View style={styles.buttonRow}>
          <Text>
            Status:{" "}
            <Text
              style={[styles.status, { color: getStatusColor(item.status) }]}
            >
              {capitalizeFirstLetter(item.status)}
            </Text>
          </Text>
          {item.status === "failed" && (
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate("InfoCancelled", { deliveryItem: item })
              }
            >
              <Text style={styles.buttonText}>view</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.trashButton}
            onPress={() => removeDeliverys(item._id)}
          >
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.containerNo}>
  <View style={styles.container}>
    {loading ? (
      <Loader />
    ) : deliveries?.length ? (
      <>
        <View style={styles.riderInfo}>
          <Image
            source={{
              uri:
                deliveries[0]?.assignedTo?.image?.url ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEL1_AFmfB9y1WAQ_lEcF7z8DFGDPQpycmw&s",
            }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.riderNameTitle}>Rider Name:</Text>
            <Text style={styles.riderName}>
              {deliveries[0]?.assignedTo?.firstName} {deliveries[0]?.assignedTo?.lastName}
            </Text>
          </View>
        </View>
        <Text style={styles.instructions}>Assign order for this rider.</Text>
        <FlatList
          data={deliveries}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
        />
      </>
    ) : (
      <>
        <Text style={styles.instructions}>No deliveries assigned yet.</Text>
        <Text style={styles.instructions}>Assign order for this rider.</Text>
      </>
    )}
  </View>
</View>
  );
};

export default Assign;
